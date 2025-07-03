import axios from "axios";
import { APIURL } from "@/app/constant/baseUrl";
import { ChatResponse } from "@/ultils/types";

export const createChat = async (newChat: ChatResponse) => {
  try {
    const response = await axios.post(`${APIURL}/chats`, newChat, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.log("test error", error);
  }
};
