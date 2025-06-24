"use client";

import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Sidebar from "@/app/content/components/Sidebar";
import axios from "axios";
import { APIURL } from "@/app/constant/baseUrl";
import { UserName } from "@/ultils/types";

const UserContext = createContext<{
  user: UserName | null;
  errorUser: string;
}>({
  user: null,
  errorUser: "",
});

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserName | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("User ID not found");
      return;
    }
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${APIURL}/users/${userId}`, {
          withCredentials: true,
        });
        setUser(res.data[0]);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch user");
      }
    };
    fetchUser();
  }, []);

  const handleLogOut = async () => {
    try {
      await axios.post(`${APIURL}/logout`, null, { withCredentials: true });
      localStorage.removeItem("userId");
      router.push("/auth/login");
    } catch (error: any) {
      setError(error.response?.data?.error || "Logout failed");
    }
  };

  return (
    <UserContext.Provider value={{ user, errorUser: error }}>
      <Box sx={{ display: "flex", height: "100vh" }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <AppBar
            position="static"
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
          >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6">MyLogo</Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar alt={user?.username || ""} src="/avatar.jpg" />
                <IconButton onClick={handleLogOut}>
                  <ArrowDropDownIcon />
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>

          <Box sx={{ p: 3, flexGrow: 1, overflowY: "auto" }}>{children}</Box>
        </Box>
      </Box>
    </UserContext.Provider>
  );
}
