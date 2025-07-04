// app/content/chat/[chatId]/page.tsx
import React from "react";
import { APIURL } from "@/app/constant/baseUrl";
import { Box, Typography, Grid } from "@mui/material";
import { fetchWithAuth } from "@/app/lib/api";
import ChatForm from "./ChatForm";
import { UserName } from "@/ultils/types";

export default async function UserListPage() {
  const { data: users, error } = (await fetchWithAuth(`${APIURL}/users`)) as {
    data: UserName[];
    error: React.ReactNode;
  };
  if (error) return error;
  return (
    <>
      <Typography variant="h6">Chat Messages</Typography>
      <Grid container spacing={2}>
        {users?.map((userItem: UserName) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={userItem.id}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography variant="body2">{userItem.username}</Typography>
              <ChatForm userId={userItem.id} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
