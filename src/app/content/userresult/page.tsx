"use client";
import React, { useEffect, useRef } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import { searchUser } from "@/app/api/userApi";
import { UserName } from "@/ultils/types";

export default function UserResultPage() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [userName, setUserName] = React.useState("");

  const LIMIT = 10;
  useEffect(() => {
    const name = searchParams.get("search") || "";
    setUserName(name);

    // Remove cached query so React Query can reload fresh
    queryClient.removeQueries({ queryKey: ["users", name] });
  }, [searchParams, queryClient]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery<UserName[]>({
      queryKey: ["users", userName],
      queryFn: async ({ pageParam = 0 }) => {
        const result = await searchUser({
          userName,
          limit: LIMIT,
          offset: pageParam,
        });
        return result ?? [];
      },
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage || lastPage.length < LIMIT) return undefined;
        return allPages.length * LIMIT;
      },
      enabled: !!userName,
      initialPageParam: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      staleTime: 0,
    });

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  console.log("test data", data);

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

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" mb={2}>
        Search results for {userName}
      </Typography>

      {status === "pending" && <Typography>Loading...</Typography>}

      {status === "error" && (
        <Typography color="error">Error loading users.</Typography>
      )}

      <Box
        sx={{
          minHeight: "100vh",
          paddingBottom: 8,
        }}
      >
        <Grid container spacing={2}>
          {data?.pages.flat().map((userItem: UserName) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={userItem.id}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Typography variant="body2">{userItem.username}</Typography>
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
    </Box>
  );
}
