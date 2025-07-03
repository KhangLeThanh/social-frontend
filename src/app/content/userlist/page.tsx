"use client";
import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useUser } from "../layout.content";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { createChat } from "@/app/api/chatApi";
import { getUsers } from "@/app/api/userApi";
import { Typography, Button, Box } from "@mui/material";
import { UserName, ErrorResponse, ChatResponse } from "@/ultils/types";

export default function UserListPage() {
  const { user } = useUser();

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  const router = useRouter();
  const { mutateAsync: createNewChat } = useMutation({
    mutationFn: createChat,
    onSuccess: async (data) => {
      const chatId = data.id;
      router.push(`/content/chat/${chatId}`);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error(
        error.response?.data?.message || "Error updating user task"
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
      <Typography variant="h6">User List</Typography>

      {users?.map((userItem: UserName) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
          key={userItem.id}
        >
          <Typography variant="body2">{userItem.username}</Typography>
          {user?.id !== userItem.id && (
            <Button
              onClick={() => handleClick(userItem.id)}
              variant="contained"
              color="primary"
            >
              Chat
            </Button>
          )}
        </Box>
      ))}
    </>
  );
}
