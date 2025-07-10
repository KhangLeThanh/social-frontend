"use client";
import React, { use } from "react";
import { useUser } from "../../layout.content";
import { useQuery } from "@tanstack/react-query";
import { getPersonalPost } from "@/app/api/postApi";
import { Avatar, Box, Typography } from "@mui/material";
import { PostProfile } from "@/ultils/types";
import PostForm from "@/app/content/sharedcomponents/PostForm";

type ProfilePageProps = {
  params: Promise<{ userId: string }>;
};
export default function ProfilePage({ params }: ProfilePageProps) {
  const { user } = useUser();

  const { userId } = use(params);
  const userIdNumber = parseInt(userId, 10);
  const { data: posts } = useQuery<PostProfile[]>({
    queryKey: ["posts", userIdNumber],
    queryFn: () => getPersonalPost(userIdNumber),
    enabled: !!userIdNumber,
  });

  return (
    <main>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {user && (
          <PostForm
            userId={user.id}
            authorName={user?.username}
            postUserId={userIdNumber}
          />
        )}
      </Box>
      {posts &&
        posts.map((post) => (
          <Box
            key={post.id}
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              pb: 2,
              pt: 2,
              borderBottom: "0.1rem solid rgb(154, 154, 154)",
            }}
          >
            {post.userId !== userIdNumber ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Avatar>{post.authorUsername.charAt(0)}</Avatar>
                <Typography variant="body2">
                  {post.authorUsername}{" "}
                </Typography>{" "}
                {" > "}
                <Typography variant="body2">
                  {post.receiverUsername}:
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Avatar>{post.authorUsername.charAt(0)}</Avatar>
                <Typography variant="body2">{post.authorUsername}: </Typography>
              </Box>
            )}
            <Typography variant="body1" sx={{ pt: 1 }}>
              {post.content}
            </Typography>
          </Box>
        ))}
    </main>
  );
}
