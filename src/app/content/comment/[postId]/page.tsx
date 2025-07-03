"use client";
import React, { useState, useEffect, use } from "react";
import { useUser } from "../../layout.content";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  TextField,
  FormControl,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { getComment, createComment, updateComment } from "@/app/api/commentApi";
import { AxiosError } from "axios";
import { Comment, ErrorResponse, CommentResponse } from "@/ultils/types";
import CommentDialog from "./CommentDialog";
import { CONNECTINGSOCKET } from "@/app/constant/socket";

type CommentPageProps = {
  params: Promise<{ postId: string }>;
};
export default function CommentPage({ params }: CommentPageProps) {
  const queryClient = useQueryClient();
  const { postId } = use(params);
  const postIdNumber = parseInt(postId, 10);
  const { user } = useUser();
  const [content, setContent] = useState<string>("");
  const [contentComment, setContentComment] = useState<string>("");

  const [commentId, setCommentId] = useState<number>(0);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
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
      queryClient.invalidateQueries({ queryKey: ["comments", postIdNumber] });
      setContent("");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error(
        error.response?.data?.message || "Error updating user task"
      );
    },
  });
  const { mutateAsync: updateCommentInfo } = useMutation({
    mutationFn: updateComment,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postIdNumber] });
      setContentComment("");
      setIsEdit(false);
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

    CONNECTINGSOCKET.on("comment_status", handleNewComment);

    return () => {
      CONNECTINGSOCKET.off("comment_status", handleNewComment);
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
  const handleEdit = (id: number, content: string) => {
    setIsEdit(true);
    setCommentId(id);
    setContentComment(content);
  };
  const handleDelete = (id: number) => {
    setShowDialog(true);
    setCommentId(id);
  };
  const handleUpdate = async () => {
    if (commentId) {
      const comment: { commentId: number; content: string } = {
        content: contentComment,
        commentId,
      };
      await updateCommentInfo(comment);
    }
  };
  return (
    <div>
      <Typography variant="h6">Comments</Typography>
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
          {isEdit && comment.id === commentId ? (
            <Box>
              <TextField
                value={contentComment}
                onChange={(e) => setContentComment(e.target.value)}
              />
              <Button
                onClick={() => {
                  setIsEdit(false);
                  setCommentId(0);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdate}>Save</Button>
            </Box>
          ) : (
            <Typography variant="body2"> {comment.content}</Typography>
          )}
          {user?.id === comment.userId && (
            <>
              <IconButton
                onClick={() => handleEdit(comment.id, comment.content)}
              >
                <EditOutlinedIcon />
              </IconButton>

              <IconButton onClick={() => handleDelete(comment.id)}>
                <DeleteOutlineOutlinedIcon />
              </IconButton>
            </>
          )}
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
      <CommentDialog
        commentId={commentId}
        isOpen={showDialog}
        onClose={() => {
          setShowDialog(false);
          setCommentId(0);
        }}
        onConfirm={() => {
          setShowDialog(false);
          setCommentId(0);
        }}
      />
    </div>
  );
}
