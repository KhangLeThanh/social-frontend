import axios from "axios";
import { APIURL } from "@/app/constant/baseUrl";
import { FriendRequestResponse } from "@/ultils/types";

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
