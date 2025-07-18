"use client";

import { useState } from "react";
import axios from "axios";
import { APIURL } from "@/app/constant/baseUrl";
import { TextField, Button, Typography, Box } from "@mui/material";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    try {
      await axios.post(
        `${APIURL}/users`,
        {
          userName,
          password,
        },
        {
          withCredentials: true,
        }
      );

      const loginResponse = await axios.post(
        `${APIURL}/login`,
        {
          userName,
          password,
        },
        {
          withCredentials: true,
        }
      );
      const user = loginResponse.data;
      localStorage.setItem("userId", user.id);
      router.push("/content/dashboard");
    } catch (error: any) {
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("Login failed");
      }
    }
  };

  return (
    <main>
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
          Register
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
        <Button variant="contained" onClick={handleRegister}>
          Register
        </Button>
      </Box>
    </main>
  );
}
