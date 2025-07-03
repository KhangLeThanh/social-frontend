"use client";
import React, { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMessage } from "@/app/api/messageApi";
import { Message } from "@/ultils/types";
import { Typography } from "@mui/material";
import SendMessageForm from "./SendMessageForm";

type ChatPageProps = {
  params: Promise<{ chatId: string }>;
};

export default function ChatPage({ params }: ChatPageProps) {
  const { chatId } = use(params);
  const chatIdNumber = parseInt(chatId, 10);
  const { data: messages } = useQuery<Message[]>({
    queryKey: ["messages", chatIdNumber],
    queryFn: () => getMessage({ chatId: chatIdNumber }),
    enabled: !!chatIdNumber,
  });
  return (
    <div>
      <Typography variant="h6">Chat</Typography>

      {messages &&
        messages.map((msg) => (
          <Typography key={msg.id} variant="body2">
            <strong>{msg.username}:</strong> {msg.content}
          </Typography>
        ))}

      <SendMessageForm chatId={chatIdNumber} />
    </div>
  );
}
