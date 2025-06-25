"use client";
import React, { useState, useEffect, use } from "react";
import { useUser } from "../../layout.content";
import { io } from "socket.io-client";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { TextField, FormControl, Button, Typography, Box } from "@mui/material";
import { getComment, createComment } from "@/app/api/commentApi";
import { AxiosError } from "axios";
import { Comment, ErrorResponse, CommentResponse } from "@/ultils/types";

const socket = io("http://localhost:3000");

type CommentPageProps = {
  params: Promise<{ postId: string }>;
};
export default function CommentPage({ params }: CommentPageProps) {
  const queryClient = useQueryClient();
  const { postId } = use(params);
  const postIdNumber = parseInt(postId, 10);
  const { user } = useUser();
  const [content, setContent] = useState<string>("");

  const {
    data: comments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["comments", postIdNumber],
    queryFn: () => getComment({ postId: postIdNumber }),
    enabled: !!postIdNumber,
  });
  const { mutateAsync: createCommentInfo } = useMutation({
    mutationFn: createComment,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error(
        error.response?.data?.message || "Error updating user task"
      );
    },
  });
  useEffect(() => {
    const handleNewComment = () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postIdNumber] });
    };

    socket.on("comment_status", handleNewComment);

    return () => {
      socket.off("comment_status", handleNewComment);
    };
  }, [postIdNumber, queryClient]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading comments</p>;
  const handleConfirm = async () => {
    if (user) {
      const comment: CommentResponse = {
        content,
        userId: user.id,
        postId: postIdNumber,
      };
      await createCommentInfo(comment);
    }
  };
  return (
    <div>
      <h2>Comments</h2>
      {comments?.map((comment: Comment) => (
        <Box
          key={comment.id}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            borderBottom: "0.1rem solid rgb(154, 154, 154)",
            pb: 2,
            pt: 2,
          }}
        >
          <Typography variant="h6">{comment.username}</Typography>:{" "}
          <Typography variant="body2"></Typography>
          {comment.content}
        </Box>
      ))}
      <FormControl fullWidth margin="normal">
        <TextField
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <Button type="submit" onClick={handleConfirm}>
          {" "}
          Add comment
        </Button>
      </FormControl>
    </div>
  );
}
