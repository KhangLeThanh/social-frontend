"use client";
import React, { use } from "react";
import { useUser } from "../../layout.content";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPersonalPost, getProfilePost } from "@/app/api/postApi";
import { getUser } from "@/app/api/userApi";
import { sendRequest } from "@/app/api/friendApi";
import { Avatar, Box, Button, Typography } from "@mui/material";
import {
  ErrorResponse,
  PostProfile,
  UserName,
  FriendRequestResponse,
} from "@/ultils/types";
import { AxiosError } from "axios";
import PostForm from "@/app/content/sharedcomponents/PostForm";
import { StatusFriendRequest } from "@/ultils/enum";

type ProfilePageProps = {
  params: Promise<{ userId: string }>;
};
export default function ProfilePage({ params }: ProfilePageProps) {
  const { user } = useUser();

  const { userId } = use(params);
  const userIdNumber = parseInt(userId, 10);
  const shouldFetch = !!user && !!userIdNumber;
  const queryClient = useQueryClient();

  const { data: posts } = useQuery<PostProfile[]>({
    queryKey: ["posts", userIdNumber],
    queryFn: () => {
      return userIdNumber === user?.id
        ? getProfilePost(userIdNumber)
        : getPersonalPost(userIdNumber);
    },
    enabled: shouldFetch,
  });
  const { data: userProfile } = useQuery<UserName>({
    queryKey: ["user", userIdNumber],
    queryFn: () => {
      return getUser({ userId: userIdNumber });
    },
    enabled: !!userIdNumber,
  });
  const { mutateAsync: sendFriendRequest } = useMutation({
    mutationFn: sendRequest,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error(
        error.response?.data?.message || "Error sending user request"
      );
    },
  });
  const handleRequest = async () => {
    if (user) {
      const friendRequest: FriendRequestResponse = {
        status: StatusFriendRequest.Pending,
        senderId: user.id,
        receiverId: userIdNumber,
      };
      await sendFriendRequest(friendRequest);
    }
  };
  console.log("test userProfile", userProfile);
  return (
    <main>
      {userProfile && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h5">{userProfile.username}</Typography>
          {userIdNumber !== user?.id && (
            <Button variant="contained" onClick={handleRequest}>
              Add Friend
            </Button>
          )}
        </Box>
      )}

      {user && (
        <PostForm
          userId={user.id}
          authorName={user?.username}
          postUserId={userIdNumber}
        />
      )}
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
