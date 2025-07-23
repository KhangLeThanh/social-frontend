"use client";
import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Menu, MenuItem } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { sendRequest, acceptRequest, cancelRequest } from "@/app/api/friendApi";
import {
  ErrorResponse,
  FriendRequestResponse,
  AcceptFriendRequestResponse,
} from "@/ultils/types";
import { AxiosError } from "axios";
import { MenuPositions, StatusFriendRequest } from "@/ultils/enum";
import { CONNECTINGSOCKET } from "@/app/constant/socket";

export default function FriendRequestAction({
  checkedFriend,
  userId,
  profileId,
  status,
  requestId,
}: {
  checkedFriend: boolean;
  userId: number;
  status: StatusFriendRequest;
  profileId: number;
  requestId: number;
}) {
  const [anchorEl, setAnchorEl] = useState<null | any>(null);
  const open = Boolean(anchorEl);

  const queryClient = useQueryClient();

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
  const { mutateAsync: acceptFriendRequest } = useMutation({
    mutationFn: acceptRequest,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error(
        error.response?.data?.message || "Error updating user request"
      );
    },
  });
  const { mutateAsync: cancelFriendRequest } = useMutation({
    mutationFn: cancelRequest,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error(
        error.response?.data?.message || "Error deleting user request"
      );
    },
  });
  useEffect(() => {
    const handleNewRequest = () => {
      queryClient.invalidateQueries({
        queryKey: ["userFriendShip"],
      });
    };

    CONNECTINGSOCKET.on("friend_reqeust_status", handleNewRequest);

    return () => {
      CONNECTINGSOCKET.off("friend_reqeust_status", handleNewRequest);
    };
  }, [queryClient]);
  const handleRequest = async (status: StatusFriendRequest) => {
    const friendRequest: FriendRequestResponse = {
      status,
      senderId: userId,
      receiverId: profileId,
    };
    const acceptedFriendRequest: AcceptFriendRequestResponse = {
      requestId,
      status,
    };
    if (status === StatusFriendRequest.Pending) {
      await sendFriendRequest(friendRequest);
    } else if (status === StatusFriendRequest.Accepted) {
      await acceptFriendRequest(acceptedFriendRequest);
    } else {
      await cancelFriendRequest(requestId);
    }
  };
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  console.log("test requestId", requestId);
  return checkedFriend ? (
    <>
      <Button
        variant="contained"
        endIcon={<KeyboardArrowDownIcon />}
        onClick={(event) => handleOpen(event)}
      >
        {status}
      </Button>
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
            handleRequest(StatusFriendRequest.Accepted);
            setAnchorEl(null);
          }}
        >
          Accept
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleRequest(StatusFriendRequest.Rejected);
            setAnchorEl(null);
          }}
        >
          Reject
        </MenuItem>
      </Menu>
    </>
  ) : (
    <Button
      variant="contained"
      onClick={() => handleRequest(StatusFriendRequest.Pending)}
    >
      Add Friend
    </Button>
  );
}
