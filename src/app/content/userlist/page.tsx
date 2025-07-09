// app/content/chat/[chatId]/page.tsx
import React from "react";
import { APIURL } from "@/app/constant/baseUrl";
import { Typography, Grid } from "@mui/material";
import { fetchWithAuth } from "@/app/lib/api";
import UserMenu from "./UserMenu";
import { UserName } from "@/ultils/types";

export default async function UserListPage() {
  const { data: users, error } = (await fetchWithAuth(`${APIURL}/users`)) as {
    data: UserName[];
    error: React.ReactNode;
  };
  if (error) return error;

  return (
    <>
      <Typography variant="h6">User List</Typography>
      <Grid container spacing={2}>
        <UserMenu initialUsers={users} />
      </Grid>
    </>
  );
}
