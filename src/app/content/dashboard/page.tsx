"use client";
import React from "react";
import { useUser } from "../layout.content";
import { Box } from "@mui/material";
import ContentPost from "./ContentPost";
import PostForm from "@/app/content/sharedcomponents/PostForm";

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <main>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {user && <PostForm userId={user.id} authorName={user?.username} />}
      </Box>
      <ContentPost userId={user?.id} />
    </main>
  );
}
