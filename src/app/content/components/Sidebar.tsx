"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
} from "@mui/material";

const drawerWidth = 240;
const navItems = [
  { label: "Dashboard", href: "/content/dashboard" },
  { label: "User List", href: "/content/userlist" },
];
export default function Sidebar() {
  const pathname = usePathname();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          {navItems.map(({ label, href }) => (
            <ListItemButton
              key={href}
              component={Link}
              href={href}
              selected={pathname === href}
            >
              <ListItemText primary={label} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
