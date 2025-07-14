"use client";
import React, { useState } from "react";
import { useUser } from "../layout.content";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { createPost } from "@/app/api/postApi";
import {
  Typography,
  TextField,
  FormControl,
  Button,
  Grid,
} from "@mui/material";
import { PostResponse, ErrorResponse } from "@/ultils/types";

type PostFormProps = {
  userId: number;
  postUserId?: number;
  authorName?: string;
};
export default function PostForm({
  userId,
  postUserId,
  authorName,
}: PostFormProps) {
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
        userId: userId,
        postUserId: postUserId ? postUserId : userId,
      };
      await createPostInfo(post);
    }
  };
  return (
    <main>
      <Grid container spacing={2} sx={{ alignItems: "center" }}>
        <Grid size={{ xs: 12, sm: 1, md: 1 }}>
          {authorName && <Typography variant="h6">{authorName}:</Typography>}
        </Grid>
        <Grid size={{ xs: 12, sm: 11, md: 11 }}>
          <FormControl fullWidth margin="normal">
            <TextField
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Write something..."
            />
            <Button type="submit" onClick={handleConfirm}>
              {" "}
              Save
            </Button>
          </FormControl>
        </Grid>
      </Grid>
    </main>
  );
}
