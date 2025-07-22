"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMutation, useInfiniteQuery } from "@tanstack/react-query";
import { useUser } from "../layout.content";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { createChat } from "@/app/api/chatApi";
import {
  Box,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  CircularProgress,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { ErrorResponse, ChatResponse, UserName } from "@/ultils/types";
import { MenuPositions } from "@/ultils/enum";
import { getUsers } from "@/app/api/userApi";

const LIMIT = 20;

export default function UserMenuPage() {
  const { user } = useUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userId, setUserId] = useState<number>(0);
  const router = useRouter();

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

  const { mutateAsync: createNewChat } = useMutation({
    mutationFn: createChat,
    onSuccess: async (data) => {
      const chatId = data.id;
      router.push(`/content/chat/${chatId}`);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error(
        error.response?.data?.message || "Error creating a new chat"
      );
    },
  });

  const handleOpen = (event: React.MouseEvent<HTMLElement>, id: number) => {
    event.stopPropagation();
    setUserId(id);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setUserId(0);
  };

  const handleClick = async () => {
    if (user) {
      const newChat: ChatResponse = {
        senderId: user.id,
        receiverId: userId,
      };
      await createNewChat(newChat);
    }
  };

  const open = Boolean(anchorEl);
  const handleProfile = () => {
    if (user) {
      router.push(`/content/profile/${userId}`);
    }
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

      <Menu
        anchorEl={anchorEl}
        id="action-menu"
        open={open}
        onClose={handleClose}
        onClick={(event) => {
          event.stopPropagation();
          handleClose();
        }}
        transformOrigin={{
          horizontal: MenuPositions.RIGHT,
          vertical: MenuPositions.TOP,
        }}
        anchorOrigin={{
          horizontal: MenuPositions.RIGHT,
          vertical: MenuPositions.BOTTOM,
        }}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            handleProfile();
          }}
        >
          View Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClick();
            setAnchorEl(null);
          }}
        >
          Chat
        </MenuItem>
      </Menu>
    </>
  );
}
