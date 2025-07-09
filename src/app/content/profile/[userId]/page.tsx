"use client";
import React, { use } from "react";
import { useUser } from "../../layout.content";
import { useQuery } from "@tanstack/react-query";
import { getPersonalPost } from "@/app/api/postApi";
import { Box, Typography } from "@mui/material";
import { Post } from "@/ultils/types";

type ProfilePageProps = {
  params: Promise<{ userId: string }>;
};
export default function ProfilePage({ params }: ProfilePageProps) {
  const { user } = useUser();

  const { userId } = use(params);
  const userIdNumber = parseInt(userId, 10);
  const { data: posts } = useQuery<Post[]>({
    queryKey: ["posts", userIdNumber],
    queryFn: () => getPersonalPost(userIdNumber),
    enabled: !!userIdNumber,
  });
  return (
    <main>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {user ? <Typography variant="h6">{user.username}: </Typography> : ""}
      </Box>
      {posts &&
        posts.map((post) => (
          <Typography key={post.id}>{post.content}</Typography>
        ))}
    </main>
  );
}
