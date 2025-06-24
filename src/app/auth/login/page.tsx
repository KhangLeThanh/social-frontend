"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { TextField, Button, Typography, Box } from "@mui/material";
import { APIURL } from "@/app/constant/baseUrl";

export default function LoginPage() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${APIURL}/login`,
        {
          userName,
          password,
        },
        {
          withCredentials: true,
        }
      );

      localStorage.setItem("userId", response.data.userId);
      router.push("/content/dashboard");
    } catch (error: any) {
      console.log("test error", error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("Login failed");
      }
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 360,
        mx: "auto",
        mt: 8,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h4" component="h1" textAlign="center">
        Login
      </Typography>
      {error && (
        <Typography color="error" textAlign="center">
          {error}
        </Typography>
      )}
      <TextField
        label="Username"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" onClick={handleLogin}>
        Login
      </Button>
    </Box>
  );
}
