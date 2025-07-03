"use client";
import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMessage } from "@/app/api/messageApi";
import { Button, FormControl, TextField } from "@mui/material";
import { ErrorResponse, MessageResponse } from "@/ultils/types";
import { AxiosError } from "axios";
import { useUser } from "../../layout.content";
import { CONNECTINGSOCKET } from "@/app/constant/socket";

type SendMessageProps = {
  chatId: number;
};
export default function ChatPage({ chatId }: SendMessageProps) {
  const [content, setContent] = useState("");
  const { user } = useUser();

  const queryClient = useQueryClient();

  const { mutateAsync: sendMessageInfo } = useMutation({
    mutationFn: createMessage,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
      setContent("");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error(
        error.response?.data?.message || "Error sending user message"
      );
    },
  });
  useEffect(() => {
    const handleNewMessage = () => {
      queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
    };

    CONNECTINGSOCKET.on("message_status", handleNewMessage);

    return () => {
      CONNECTINGSOCKET.off("message_status", handleNewMessage);
    };
  }, [chatId, queryClient]);
  const handleConfirm = async () => {
    if (user) {
      const message: MessageResponse = {
        content,
        userId: user.id,
        chatId,
      };
      await sendMessageInfo(message);
    }
  };
  return (
    <>
      <FormControl fullWidth margin="normal">
        <TextField
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <Button type="submit" onClick={handleConfirm}>
          {" "}
          send
        </Button>
      </FormControl>
    </>
  );
}
