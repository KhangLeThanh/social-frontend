"use client";
import React, { useCallback, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { searchUser } from "@/app/api/userApi";
import { UserName } from "@/ultils/types";

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const userName = searchParams.get("search") || ""; // get search from query string
  const LIMIT = 10;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery<UserName[]>({
      queryKey: ["users", userName],
      queryFn: ({ pageParam = 0 }) =>
        searchUser({ userName, limit: LIMIT, offset: pageParam }),
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length < LIMIT) return undefined;
        return allPages.length * LIMIT;
      },
      enabled: userName.length > 0,
      initialPageParam: 0,
    });

  // Scroll handling: load more when near bottom
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" mb={2}>
        Search results for {userName}
      </Typography>

      {status === "pending" && <Typography>Loading...</Typography>}

      {status === "error" && (
        <Typography color="error">Error loading users.</Typography>
      )}

      {data?.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.map((user) => (
            <Box
              key={user.id}
              sx={{
                borderBottom: "1px solid #ccc",
                py: 1,
              }}
            >
              <Typography>{user.username}</Typography>
            </Box>
          ))}
        </React.Fragment>
      ))}

      {isFetchingNextPage && <Typography>Loading more...</Typography>}

      {!hasNextPage && data && data.pages.flat().length > 0 && (
        <Typography sx={{ mt: 2, textAlign: "center" }}>
          No more users
        </Typography>
      )}
    </Box>
  );
}
