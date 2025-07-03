// app/content/chat/[chatId]/page.tsx
import React from "react";
import { APIURL } from "@/app/constant/baseUrl";
import { Typography } from "@mui/material";
import { fetchWithAuth } from "@/app/lib/api";
import { Message } from "@/ultils/types";
import SendMessageForm from "./SendMessageForm";

type ChatPageProps = {
  params: Promise<{ chatId: string }>;
};

export default async function ChatPage({ params }: ChatPageProps) {
  const { chatId } = await params;

  const { data: messages, error } = await fetchWithAuth(
    `${APIURL}/messages/${chatId}`
  );

  if (error) return error;
  return (
    <>
      <Typography variant="h6">Chat Messages</Typography>
      <SendMessageForm
        chatId={parseInt(chatId, 10)}
        initialMessages={messages as Message[]}
      />
    </>
  );
}
