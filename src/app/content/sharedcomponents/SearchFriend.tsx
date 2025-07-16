import React, { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { UserName } from "@/ultils/types";
import { searchUser } from "@/app/api/userApi";
import { useQuery } from "@tanstack/react-query";

export default function SearchFriend() {
  const [textInput, setTextInput] = useState<string>("");

  const {
    data: userList,
    isLoading,
    isError,
  } = useQuery<UserName[]>({
    queryKey: ["users", textInput],
    queryFn: () => searchUser({ userName: textInput }),
    enabled: textInput.trim().length > 0,
  });

  return (
    <Box sx={{ pl: 4, position: "relative" }}>
      <TextField
        placeholder="Search..."
        fullWidth
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        InputProps={{
          sx: {
            color: "#fff",
            "&::placeholder": {
              color: "#fff",
              opacity: 1,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#fff",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#fff",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#fff",
            },
          },
        }}
      />

      {textInput.trim().length > 0 && (
        <Box
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            zIndex: 10,
            maxHeight: 200,
            overflowY: "auto",
            border: "1px solid #ccc",
          }}
        >
          {isLoading ? (
            <Box sx={{ p: 1 }}>
              <Typography variant="body2">Loading...</Typography>
            </Box>
          ) : isError ? (
            <Box sx={{ p: 1 }}>
              <Typography variant="body2" color="error">
                Error fetching users
              </Typography>
            </Box>
          ) : userList && userList.length > 0 ? (
            userList.map((user) => (
              <Box
                key={user.id}
                sx={{
                  borderBottom: "1px solid #eee",
                  px: 2,
                  py: 1,
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
              >
                <Typography variant="body2" sx={{ color: "#444" }}>
                  {user.username}
                </Typography>
              </Box>
            ))
          ) : (
            <Box sx={{ p: 1 }}>
              <Typography variant="body2" sx={{ color: "#444" }}>
                No user found
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
