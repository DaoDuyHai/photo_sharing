import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

function TopBar({ isLoggedIn, user, onLogout, onUploadSuccess }) {
  const location = useLocation();
  const path = location.pathname;
  const [contextText, setContextText] = useState("");

  useEffect(() => {
    const updateTitle = async () => {
      const isUserOrPhotoPage =
        path.includes("/users/") || path.includes("/photos/");
      if (!isLoggedIn || !user || !isUserOrPhotoPage) {
        setContextText("");
        return;
      }
      const userId = path.split("/")[2];
      try {
        const response = await fetchModel(`/api/user/${userId}`);
        const name = `${response.data.first_name || ""} ${response.data.last_name || ""}`.trim();
        if (path.includes("/photos/")) {
          setContextText(`Ảnh của ${name}`);
        } else {
          setContextText(`Hồ sơ ${name}`);
        }
      } catch (error) {
        setContextText("");
      }
    };
    updateTitle();
  }, [path, isLoggedIn, user]);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      await fetchModel("/api/photo/new", {
        method: "POST",
        body: formData,
      });

      if (onUploadSuccess) onUploadSuccess();
      event.target.value = ""; // Reset input file
    } catch (err) {
      alert(err.message || "Lỗi khi upload ảnh");
    }
  };

  const renderRightContent = () => {
    if (!isLoggedIn) {
      if (path.includes("/register"))
        return <Typography variant="subtitle1">Vui lòng đăng ký</Typography>;
      return <Typography variant="subtitle1">Vui lòng đăng nhập</Typography>;
    }

    return (
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="topbar-upload-file"
          type="file"
          onChange={handleUpload}
        />
        <label htmlFor="topbar-upload-file">
          <Button
            variant="contained"
            component="span"
            size="small"
            color="success"
            sx={{ textTransform: "none" }}
          >
            Đăng ảnh mới
          </Button>
        </label>

        <Button
          variant="contained"
          onClick={onLogout}
          size="small"
          color="error"
          sx={{ textTransform: "none" }}
        >
          Đăng xuất
        </Button>
      </Box>
    );
  };

  return (
    <AppBar
      position="absolute"
      variant="outlined"
      sx={{ zIndex: 1201, elevation: 0 }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {isLoggedIn && user ? `Xin chào, ${user.first_name}` : "Photo Sharing"}
        </Typography>
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
          {contextText}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {renderRightContent()}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
