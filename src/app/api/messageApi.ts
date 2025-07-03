import axios from "axios";
import { APIURL } from "@/app/constant/baseUrl";
import { MessageResponse } from "@/ultils/types";

export const createMessage = async (newMessage: MessageResponse) => {
  try {
    const response = await axios.post(`${APIURL}/messages`, newMessage, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.log("test error", error);
  }
};

export const getMessage = async ({ chatId }: { chatId: number }) => {
  try {
    const response = await axios.get(`${APIURL}/messages/${chatId}`, {
      withCredentials: true,
    });
    console.log("test res", response);
    return response.data;
  } catch (error: any) {
    console.log("test error", error);
  }
};
