"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { getPosts, getOnePost, updatePost } from "@/app/api/postApi";
import {
  Typography,
  Box,
  Avatar,
  Button,
  IconButton,
  TextField,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Post, ErrorResponse } from "@/ultils/types";
import { AxiosError } from "axios";
import PostDialog from "./PostDialog";

const socket = io("http://localhost:3000");

export default function ContentPost({ userId }: { userId?: number }) {
  const { data: posts } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  const queryClient = useQueryClient();
  const [postId, setPostId] = useState<number>(0);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [contentPost, setContentPost] = useState<string>("");

  const { data: post } = useQuery<Post>({
    queryKey: ["posts", postId],
    queryFn: () => getOnePost(postId),
    enabled: !!postId,
  });
  useEffect(() => {
    const handleNewPost = () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    };

    socket.on("post_status", handleNewPost);

    return () => {
      socket.off("post_status", handleNewPost);
    };
  }, [queryClient]);
  useEffect(() => {
    if (post) {
      setContentPost(post.content);
    }
  }, [post]);
  const { mutateAsync: updatePostInfo } = useMutation({
    mutationFn: updatePost,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setIsEdit(false);
      setPostId(0);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error(
        error.response?.data?.message || "Error updating user task"
      );
    },
  });
  const handleEdit = (id: number) => {
    setIsEdit(true);
    setPostId(id);
  };
  const handleDelete = (id: number) => {
    setShowDialog(true);
    setPostId(id);
  };

  const handleUpdate = async () => {
    if (postId) {
      const post: { postId: number; content: string } = {
        content: contentPost,
        postId,
      };
      await updatePostInfo(post);
    }
  };

  const router = useRouter();

  const handleClick = (postId: number) => {
    router.push(`/content/comment/${postId}`);
  };
  return (
    <main>
      {posts &&
        posts
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((post) => (
            <Box
              key={post.id}
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                pb: 2,
                pt: 2,
                borderBottom: "0.1rem solid rgb(154, 154, 154)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Avatar>{post.username.charAt(0)}</Avatar>
                <Typography variant="h6">{post.username}</Typography>
                {userId === post.userId && (
                  <>
                    <IconButton onClick={() => handleEdit(post.id)}>
                      <EditOutlinedIcon />
                    </IconButton>

                    <IconButton onClick={() => handleDelete(post.id)}>
                      <DeleteOutlineOutlinedIcon />
                    </IconButton>
                  </>
                )}
              </Box>
              <Box sx={{ pt: 0.5 }}>
                {isEdit && post.id === postId ? (
                  <Box>
                    <TextField
                      value={contentPost}
                      onChange={(e) => setContentPost(e.target.value)}
                    />
                    <Button
                      onClick={() => {
                        setIsEdit(false);
                        setPostId(0);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleUpdate}>Save</Button>
                  </Box>
                ) : (
                  <Typography variant="body1">{post.content}</Typography>
                )}
                <Button
                  onClick={() => handleClick(post.id)}
                  variant="contained"
                  color="primary"
                >
                  View Comments
                </Button>
              </Box>
            </Box>
          ))}

      <PostDialog
        isOpen={showDialog}
        postId={postId}
        onClose={() => {
          setShowDialog(false);
          setPostId(0);
        }}
        onConfirm={() => {
          setShowDialog(false);
          setPostId(0);
        }}
      />
    </main>
  );
}
