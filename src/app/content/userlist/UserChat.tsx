"use client";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useUser } from "../layout.content";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { createChat } from "@/app/api/chatApi";
import {
  Box,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { ErrorResponse, ChatResponse, UserName } from "@/ultils/types";
import { MenuPositions } from "@/ultils/enum";

type UserChatProps = {
  initialUsers: UserName[];
};
export default function UserChatPage({ initialUsers }: UserChatProps) {
  const { user } = useUser();
  const [anchorEl, setAnchorEl] = useState<null | any>(null);
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
  const handleOpen = (event: React.MouseEvent<HTMLElement>, id: number) => {
    event.stopPropagation();
    setUserId(id);
    setAnchorEl(event.currentTarget);
  };
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
              <IconButton onClick={(event) => handleOpen(event, userItem.id)}>
                <ArrowDropDownIcon />
              </IconButton>
            </Box>
          </Grid>
        ))}
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
