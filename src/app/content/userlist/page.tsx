"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../layout.content";
import { useRouter } from "next/navigation";
import { getUsers } from "@/app/api/userApi";
import { Typography, Button, Box } from "@mui/material";
import { UserName } from "@/ultils/types";

export default function UserListPage() {
  const { user } = useUser();

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  const router = useRouter();

  const handleClick = (userId: number) => {
    router.push(`/content/chat/${userId}`);
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
