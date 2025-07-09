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
  Menu,
  MenuItem,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import Sidebar from "@/app/content/components/Sidebar";
import axios from "axios";
import { APIURL } from "@/app/constant/baseUrl";
import { UserName } from "@/ultils/types";
import { MenuPositions } from "@/ultils/enum";

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
  const [anchorEl, setAnchorEl] = useState<null | any>(null);

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
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogOut = async () => {
    try {
      await axios.post(`${APIURL}/logout`, null, { withCredentials: true });
      localStorage.removeItem("userId");
      router.push("/auth/login");
    } catch (error: any) {
      setError(error.response?.data?.error || "Logout failed");
    }
  };
  const handleProfile = () => {
    if (user) {
      router.push(`/content/profile/${user.id}`);
    }
  };
  const open = Boolean(anchorEl);

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
                <IconButton onClick={(event) => handleOpen(event)}>
                  <ArrowDropDownIcon />
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>
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
              <PersonIcon />
              My Profile
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleLogOut();
                setAnchorEl(null);
              }}
            >
              <LogoutIcon />
              LogOut
            </MenuItem>
          </Menu>
          <Box sx={{ p: 3, flexGrow: 1, overflowY: "auto" }}>{children}</Box>
        </Box>
      </Box>
    </UserContext.Provider>
  );
}
