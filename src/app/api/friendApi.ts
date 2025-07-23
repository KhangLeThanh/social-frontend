import axios from "axios";
import { APIURL } from "@/app/constant/baseUrl";
import { FriendRequestResponse } from "@/ultils/types";
import { StatusFriendRequest } from "@/ultils/enum";

export const sendRequest = async (newRequest: FriendRequestResponse) => {
  try {
    const response = await axios.post(`${APIURL}/friend-request`, newRequest, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.log("test error", error);
  }
};

export const acceptRequest = async ({
  requestId,
  status,
}: {
  requestId: number;
  status: StatusFriendRequest;
}) => {
  try {
    const response = await axios.patch(
      `${APIURL}/friend-request/${requestId}`,
      { status },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    console.log("test error", error);
  }
};
export const cancelRequest = async (requestId: number) => {
  try {
    const response = await axios.delete(
      `${APIURL}/friend-request/${requestId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    console.log("test error", error);
  }
};
export const getFriendShip = async ({
  userId,
  profileId,
}: {
  userId: number;
  profileId: number;
}) => {
  try {
    const response = await axios.get(
      `${APIURL}/friend-request/friend-ship/${userId}/${profileId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    console.log("test error", error);
  }
};

export const getAcceptedFriend = async (userId: number) => {
  try {
    const response = await axios.get(`${APIURL}/friend-request/${userId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.log("test error", error);
  }
};
