"use client";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useUser } from "../layout.content";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { createChat } from "@/app/api/chatApi";
import { Button } from "@mui/material";
import { ErrorResponse, ChatResponse } from "@/ultils/types";

export default function ChatFormPage({ userId }: { userId: number }) {
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
      {user?.id !== userId && (
        <Button
          onClick={() => handleClick(userId)}
          variant="contained"
          color="primary"
        >
          Chat
        </Button>
      )}
    </>
  );
}
