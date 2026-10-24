import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Grid,
  Box,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

const Register = () => {
  const navigate = useNavigate();
  const [regData, setRegData] = useState({
    login_name: "",
    password: "",
    confirm_password: "",
    first_name: "",
    last_name: "",
    location: "",
    description: "",
    occupation: "",
  });

  const [loading, setLoading] = useState(false);
  const [regMsg, setRegMsg] = useState({ type: "", text: "" });

  const handleRegisterChange = (field, value) => {
    setRegData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegMsg({ type: "", text: "" });

    if (
      !regData.login_name.trim() ||
      !regData.password ||
      !regData.first_name.trim() ||
      !regData.last_name.trim()
    ) {
      setRegMsg({
        type: "error",
        text: "Vui lòng điền đầy đủ các thông tin bắt buộc (*)",
      });
      return;
    }

    if (regData.password !== regData.confirm_password) {
      setRegMsg({ type: "error", text: "Mật khẩu xác nhận không khớp!" });
      return;
    }

    setLoading(true);
    try {
      await fetchModel("/api/auth/user", {
        method: "POST",
        body: regData,
      });

      setRegMsg({
        type: "success",
        text: "Đăng ký thành công! Đang chuyển hướng sang trang đăng nhập...",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setRegMsg({
        type: "error",
        text: err.message || "Đăng ký thất bại! Vui lòng thử lại.",
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
        minHeight: "75vh",
      }}
    >
      <Paper
        variant="outlined"
        sx={{ padding: 4, width: "100%", maxWidth: "600px", borderRadius: 2 }}
      >
        <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold", textAlign: "center" }}>
          Tạo tài khoản mới
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: "center" }}>
          Tham gia cộng đồng chia sẻ hình ảnh Photo Sharing
        </Typography>

        {regMsg.text && (
          <Alert severity={regMsg.type} sx={{ mb: 2.5 }}>
            {regMsg.text}
          </Alert>
        )}

        <form onSubmit={handleRegister}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tên đăng nhập *"
                size="small"
                value={regData.login_name}
                onChange={(e) =>
                  handleRegisterChange("login_name", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nghề nghiệp"
                size="small"
                value={regData.occupation}
                onChange={(e) =>
                  handleRegisterChange("occupation", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mật khẩu *"
                type="password"
                size="small"
                value={regData.password}
                onChange={(e) =>
                  handleRegisterChange("password", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Xác nhận mật khẩu *"
                type="password"
                size="small"
                value={regData.confirm_password}
                onChange={(e) =>
                  handleRegisterChange("confirm_password", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Họ *"
                size="small"
                value={regData.last_name}
                onChange={(e) =>
                  handleRegisterChange("last_name", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tên *"
                size="small"
                value={regData.first_name}
                onChange={(e) =>
                  handleRegisterChange("first_name", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ / Nơi sống"
                size="small"
                value={regData.location}
                onChange={(e) =>
                  handleRegisterChange("location", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mô tả bản thân"
                multiline
                rows={3}
                size="small"
                value={regData.description}
                onChange={(e) =>
                  handleRegisterChange("description", e.target.value)
                }
              />
            </Grid>
          </Grid>

          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{ mt: 3, py: 1, textTransform: "none", fontSize: "1rem" }}
          >
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </Button>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2.5 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1, alignSelf: "center" }}>
              Đã có tài khoản?
            </Typography>
            <Button
              component={Link}
              to="/login"
              size="small"
              sx={{ textTransform: "none" }}
            >
              Đăng nhập ngay
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Register;
