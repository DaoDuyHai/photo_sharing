import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Box,
  Paper,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setUser(null);

    const getUserDetail = async () => {
      try {
        const response = await fetchModel(`/api/user/${userId}`);
        setUser(response.data);
      } catch (err) {
        console.error("Lỗi lấy chi tiết User:", err);
      } finally {
        setLoading(false);
      }
    };

    getUserDetail();
  }, [userId]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
          width: "100%",
        }}
      >
        <CircularProgress size={45} />
        <Typography variant="body1" sx={{ mt: 2, color: "text.secondary" }}>
          Đang tải thông tin người dùng...
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="error">Không tìm thấy thông tin người dùng này.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Paper variant="outlined" sx={{ padding: 3, borderRadius: 2 }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: "bold", color: "#1976d2" }}>
          {user.first_name} {user.last_name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Tên tài khoản: @{user.login_name || "user"}
        </Typography>

        <Divider sx={{ mb: 2.5 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "text.secondary" }}>
            Địa điểm:
          </Typography>
          <Typography variant="body1">{user.location || "Chưa cập nhật"}</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "text.secondary" }}>
            Nghề nghiệp:
          </Typography>
          <Typography variant="body1">{user.occupation || "Chưa cập nhật"}</Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "text.secondary" }}>
            Giới thiệu bản thân:
          </Typography>
          <Typography variant="body1" sx={{ mt: 0.5 }}>
            {user.description || "Chưa có mô tả"}
          </Typography>
        </Box>

        <Button
          variant="contained"
          component={Link}
          to={`/photos/${userId}`}
          sx={{ textTransform: "none", px: 3 }}
        >
          Xem toàn bộ ảnh ({user.first_name})
        </Button>
      </Paper>
    </Box>
  );
}

export default UserDetail;
