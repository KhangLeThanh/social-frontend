// app/content/friend[userId]/page.tsx
import React from "react";
import { APIURL } from "@/app/constant/baseUrl";
import { Typography, Grid, Box, Avatar } from "@mui/material";
import { fetchWithAuth } from "@/app/lib/api";
import { UserName } from "@/ultils/types";

type FriendPageProps = {
  params: { userId: string };
};
export default async function FriendPage(props: FriendPageProps) {
  const { userId } = props.params;

  const { data: friends, error } = (await fetchWithAuth(
    `${APIURL}/friend-request/${userId}`
  )) as {
    data: UserName[];
    error: React.ReactNode;
  };
  if (error) return error;
  return (
    <>
      <Typography variant="h6">Friend List</Typography>
      <Grid container spacing={2}>
        {friends.map((friend) => (
          <Grid size={{ xs: 12, sm: 4, md: 4 }} key={friend.id}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Avatar>{friend.username.charAt(0)}</Avatar>
              <Typography variant="h6">{friend.username}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
