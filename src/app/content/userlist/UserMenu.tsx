"use client";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useUser } from "../layout.content";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { createChat } from "@/app/api/chatApi";
import { Menu, MenuItem } from "@mui/material";
import { ErrorResponse, ChatResponse } from "@/ultils/types";
import { MenuPositions } from "@/ultils/enum";
import UserCard from "./UserCard";

export default function UserMenuPage() {
  const { user } = useUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userId, setUserId] = useState<number>(0);
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

  const handleClose = () => {
    setAnchorEl(null);
    setUserId(0);
  };

  const handleClick = async () => {
    if (user) {
      const newChat: ChatResponse = {
        senderId: user.id,
        receiverId: userId,
      };
      await createNewChat(newChat);
    }
  };

  const open = Boolean(anchorEl);
  const handleProfile = () => {
    if (user) {
      router.push(`/content/profile/${userId}`);
    }
  };

  return (
    <>
      <UserCard sentOpenMenu={setAnchorEl} sentUserId={setUserId} />

      <Menu
        anchorEl={anchorEl}
        id="action-menu"
        open={open}
        onClose={handleClose}
        onClick={(event) => {
          event.stopPropagation();
          handleClose();
        }}
        transformOrigin={{
          horizontal: MenuPositions.RIGHT,
          vertical: MenuPositions.TOP,
        }}
        anchorOrigin={{
          horizontal: MenuPositions.RIGHT,
          vertical: MenuPositions.BOTTOM,
        }}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            handleProfile();
          }}
        >
          View Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClick();
            setAnchorEl(null);
          }}
        >
          Chat
        </MenuItem>
      </Menu>
    </>
  );
}
