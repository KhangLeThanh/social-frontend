"use client";
import React, { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useUser } from "../layout.content";
import {
  Box,
  Grid,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { UserName } from "@/ultils/types";
import { getUsers } from "@/app/api/userApi";

const LIMIT = 20;

type UserCard = {
  sentUserId: (id: number) => void;
  sentOpenMenu: (anchorEl: null | HTMLElement) => void;
};
export default function UserCard({ sentUserId, sentOpenMenu }: UserCard) {
  const { user } = useUser();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery<UserName[]>({
    queryKey: ["users"],
    queryFn: ({ pageParam = 0 }) =>
      getUsers({ limit: LIMIT, offset: pageParam }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < LIMIT ? undefined : allPages.length * LIMIT,
    initialPageParam: 0,
  });

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { rootMargin: "300px" }
    );

    const current = loadMoreRef.current;
    if (current) {
      observer.observe(current);
    }

    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>, id: number) => {
    event.stopPropagation();
    sentUserId(id);
    sentOpenMenu(event.currentTarget);
  };

  if (status === "pending") {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography>Loading users...</Typography>
      </Box>
    );
  }

  if (status === "error") {
    return <Typography>Error loading users: {`${error}`}</Typography>;
  }

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          paddingBottom: 8,
        }}
      >
        <Grid container spacing={2}>
          {data?.pages
            .flat()
            .filter((userItem: UserName) => userItem.id !== user?.id)
            .map((userItem: UserName) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={userItem.id}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography variant="body2">{userItem.username}</Typography>
                  <IconButton
                    onClick={(event) => handleOpen(event, userItem.id)}
                  >
                    <ArrowDropDownIcon />
                  </IconButton>
                </Box>
              </Grid>
            ))}
        </Grid>

        <Box
          ref={loadMoreRef}
          sx={{
            height: 50,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isFetchingNextPage && <CircularProgress size={24} />}
        </Box>

        {!hasNextPage && (
          <Typography sx={{ mt: 2, textAlign: "center" }}>
            No more users to load.
          </Typography>
        )}
      </Box>
    </>
  );
}
