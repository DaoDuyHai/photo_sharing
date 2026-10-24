import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

function Login({ onLoginSuccess }) {
  const [credentials, setCredentials] = useState({
    login_name: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [loginMsg, setLoginMsg] = useState({ type: "", text: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginMsg({ type: "", text: "" });

    if (!credentials.login_name || !credentials.password) {
      setLoginMsg({ type: "error", text: "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetchModel("/api/auth/login", {
        method: "POST",
        body: credentials,
      });

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        onLoginSuccess(res.data);
      } else {
        setLoginMsg({ type: "error", text: "Không nhận được token từ máy chủ" });
      }
    } catch (err) {
      setLoginMsg({
        type: "error",
        text: err.message || "Tên đăng nhập hoặc mật khẩu không chính xác!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 4,
        minHeight: "70vh",
      }}
    >
      <Paper
        variant="outlined"
        sx={{ padding: 4, width: "100%", maxWidth: "420px", borderRadius: 2 }}
      >
        <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold", textAlign: "center" }}>
          Đăng nhập
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: "center" }}>
          Chào mừng bạn quay trở lại với Photo Sharing
        </Typography>

        {loginMsg.text && (
          <Alert severity={loginMsg.type} sx={{ mb: 2 }}>
            {loginMsg.text}
          </Alert>
        )}

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Tên đăng nhập"
            variant="outlined"
            margin="normal"
            size="small"
            value={credentials.login_name}
            onChange={(e) =>
              setCredentials((prev) => ({
                ...prev,
                login_name: e.target.value,
              }))
            }
          />

          <TextField
            fullWidth
            label="Mật khẩu"
            type="password"
            variant="outlined"
            margin="normal"
            size="small"
            value={credentials.password}
            onChange={(e) =>
              setCredentials((prev) => ({ ...prev, password: e.target.value }))
            }
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{ mt: 3, py: 1, textTransform: "none", fontSize: "1rem" }}
          >
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </Button>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2.5 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1, alignSelf: "center" }}>
              Chưa có tài khoản?
            </Typography>
            <Button
              component={Link}
              to="/register"
              size="small"
              sx={{ textTransform: "none" }}
            >
              Đăng ký ngay
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default Login;
