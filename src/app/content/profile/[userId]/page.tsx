"use client";
import React, { useEffect, use, useState } from "react";
import { useUser } from "../../layout.content";
import { useQuery } from "@tanstack/react-query";
import { getPersonalPost, getProfilePost } from "@/app/api/postApi";
import { getUser } from "@/app/api/userApi";
import { getFriendShip } from "@/app/api/friendApi";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { PostProfile, UserName, FriendShip } from "@/ultils/types";
import PostForm from "@/app/content/sharedcomponents/PostForm";
import FriendRequestAction from "./FriendRequestAction";

type ProfilePageProps = {
  params: Promise<{ userId: string }>;
};
export default function ProfilePage({ params }: ProfilePageProps) {
  const { user } = useUser();

  const { userId } = use(params);
  const userIdNumber = parseInt(userId, 10);
  const shouldFetch = !!user && !!userIdNumber;
  const [checkedFriendship, setCheckedFriendship] = useState<boolean>(false);

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

  const { data: userFriendShip } = useQuery<FriendShip[]>({
    queryKey: ["userFriendShip", userIdNumber],
    queryFn: () => {
      if (!user?.id || !userIdNumber)
        return Promise.reject("Missing user info");

      return getFriendShip({
        userId: user.id,
        profileId: userIdNumber,
      });
    },
    enabled: !!userIdNumber,
  });
  useEffect(() => {
    if (userFriendShip && userFriendShip.length) {
      setCheckedFriendship(true);
    } else {
      setCheckedFriendship(false);
    }
  }, [userFriendShip]);

  console.log("test userFriendShip", userFriendShip);
  if (!user || !userFriendShip) {
    return <div>Loading...</div>;
  }
  return (
    <main>
      {userProfile && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h5">{userProfile.username}</Typography>
          {userIdNumber !== user?.id && (
            <FriendRequestAction
              checkedFriend={checkedFriendship}
              userId={user?.id ?? null}
              profileId={userIdNumber}
              status={userFriendShip?.[0]?.status ?? "unknown"}
              requestId={userFriendShip?.[0]?.id ?? null}
            />
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
