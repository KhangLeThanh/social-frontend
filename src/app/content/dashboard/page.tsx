"use client";
import React, { useState } from "react";
import { useUser } from "../layout.content";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { createPost } from "@/app/api/postApi";
import { Typography, TextField, FormControl, Button, Box } from "@mui/material";
import { PostResponse, ErrorResponse } from "@/ultils/types";
import ContentPost from "./ContentPost";

export default function DashboardPage() {
  const [content, setContent] = useState("");

  const { user } = useUser();
  const queryClient = useQueryClient();

  const { mutateAsync: createPostInfo } = useMutation({
    mutationFn: createPost,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error(
        error.response?.data?.message || "Error updating user task"
      );
    },
  });
  const handleConfirm = async () => {
    if (user) {
      const post: PostResponse = {
        content,
        userId: user.id,
        postUserId: user.id,
      };
      await createPostInfo(post);
    }
  };
  return (
    <main>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {user ? <Typography variant="h6">{user.username}: </Typography> : ""}
        <FormControl fullWidth margin="normal">
          <TextField
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <Button type="submit" onClick={handleConfirm}>
            {" "}
            Save
          </Button>
        </FormControl>
      </Box>
      <ContentPost userId={user?.id} />
    </main>
  );
}
