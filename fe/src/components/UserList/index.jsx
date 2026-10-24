import React, { useState, useEffect } from "react";
import {
  Divider,
  List,
  ListItemText,
  Typography,
  ListItemButton,
  Box,
  Badge,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

function UserList({ photoTrigger }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetchModel("/api/user/list");
        setUsers(res.data || []);
      } catch (err) {
        console.error("Lỗi khi gọi API UserList:", err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, [photoTrigger]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress size={30} />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ px: 2, py: 1.5, fontWeight: "bold" }}>
        Thành viên ({users.length})
      </Typography>
      <Divider />

      <List component="nav" disablePadding>
        {users.map((item) => {
          const isSelected = location.pathname.includes(item._id);

          return (
            <React.Fragment key={item._id}>
              <ListItemButton
                component={Link}
                to={`/users/${item._id}`}
                selected={isSelected}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1.2,
                }}
              >
                <ListItemText
                  primary={`${item.first_name} ${item.last_name}`}
                  primaryTypographyProps={{ fontSize: "0.95rem" }}
                />

                <Box sx={{ display: "flex", gap: 2.5, pr: 1 }}>
                  <Tooltip title="Tổng số ảnh đã đăng">
                    <Badge
                      badgeContent={item.photoCount || 0}
                      color="success"
                      max={99}
                      showZero
                    />
                  </Tooltip>

                  <Tooltip title="Xem các bình luận của người dùng này">
                    <Link
                      to={`/comments/${item._id}`}
                      style={{ textDecoration: "none" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Badge
                        badgeContent={item.commentCount || 0}
                        color="error"
                        max={99}
                        showZero
                      />
                    </Link>
                  </Tooltip>
                </Box>
              </ListItemButton>

              <Divider />
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );
}

export default UserList;
