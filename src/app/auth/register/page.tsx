"use client";

import { useState } from "react";
import axios from "axios";
import { APIURL } from "@/app/constant/baseUrl";
import { TextField, Button, Typography, Box } from "@mui/material";

export default function RegisterPage() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        `${APIURL}/users`,
        {
          userName,
          password,
        },
        {
          withCredentials: true, // this is important if cookies are involved
        }
      );

      const { user } = response.data;
      localStorage.setItem("userId", user.id);
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
