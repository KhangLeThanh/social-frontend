"use client";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useUser } from "../layout.content";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { createChat } from "@/app/api/chatApi";
import { Box, Button, Grid, Typography } from "@mui/material";
import { ErrorResponse, ChatResponse, UserName } from "@/ultils/types";

type UserChatProps = {
  initialUsers: UserName[];
};
export default function UserChatPage({ initialUsers }: UserChatProps) {
  const { user } = useUser();

  const router = useRouter();
  const { mutateAsync: createNewChat } = useMutation({
    mutationFn: createChat,
    onSuccess: async (data) => {
      const chatId = data.id;
      router.push(`/content/chat/${chatId}`);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error(
        error.response?.data?.message || "Error creating a new chat"
      );
    },
  });
  const handleClick = async (receiverId: number) => {
    if (user) {
      const newChat: ChatResponse = {
        senderId: user.id,
        receiverId: receiverId,
      };
      await createNewChat(newChat);
    }
  };
  return (
    <>
      {initialUsers
        ?.filter((userItem: UserName) => userItem.id !== user?.id)
        .map((userItem: UserName) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={userItem.id}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography variant="body2">{userItem.username}</Typography>
              <Button
                onClick={() => handleClick(userItem.id)}
                variant="contained"
                color="primary"
              >
                Chat
              </Button>
            </Box>
          </Grid>
        ))}
    </>
  );
}
