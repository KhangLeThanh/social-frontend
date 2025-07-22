// app/content/userlist/page.tsx
import React from "react";
import { Typography, Grid } from "@mui/material";
import UserMenu from "./UserMenu";

export default async function UserListPage() {
  return (
    <>
      <Typography variant="h6">User List</Typography>
      <Grid container spacing={2}>
        <UserMenu />
      </Grid>
    </>
  );
}
