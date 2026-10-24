import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Divider,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Box,
  CircularProgress,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import { getImageUrl } from "../../config";

function UserPhotos({ photoTrigger, onUploadSuccess }) {
  const { userId } = useParams();
  const [photos, setPhotos] = useState(null);
  const [commentTexts, setCommentTexts] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const loadPhotos = useCallback(async () => {
    try {
      const res = await fetchModel(`/api/photo/photosOfUser/${userId}`);
      setPhotos(res.data);
      setErrorMessage("");
    } catch (err) {
      console.error("Lỗi lấy danh sách ảnh:", err);
      setPhotos([]);
      setErrorMessage(err.message || "Không thể tải danh sách ảnh");
    }
  }, [userId]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos, photoTrigger]);

  const handleTextChange = (photoId, value) => {
    setCommentTexts((prev) => ({ ...prev, [photoId]: value }));
  };

  const handleAddComment = async (photoId) => {
    const text = commentTexts[photoId];
    if (!text || !text.trim()) return;

    try {
      await fetchModel(`/api/photo/commentsOfPhoto/${photoId}`, {
        method: "POST",
        body: { comment: text.trim() },
      });
      setCommentTexts((prev) => ({ ...prev, [photoId]: "" }));
      loadPhotos();

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      alert(err.message || "Không thể gửi bình luận. Vui lòng thử lại!");
    }
  };

  if (photos === null) {
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
          Đang tải danh sách ảnh...
        </Typography>
      </Box>
    );
  }

  if (photos.length === 0) {
    return (
      <Box sx={{ padding: 3, textAlign: "center" }}>
        {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
        <Typography color="text.secondary">
          Người dùng này chưa đăng bức ảnh nào.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 1 }}>
      {photos.map((photo) => (
        <Card
          key={photo._id}
          variant="outlined"
          sx={{ marginBottom: 4, borderRadius: 2 }}
        >
          {/* Header ngày giờ đăng */}
          <CardHeader
            title={`Đăng lúc: ${new Date(photo.date_time).toLocaleString("vi-VN")}`}
            titleTypographyProps={{ variant: "caption", color: "text.secondary" }}
          />

          {/* Hình ảnh */}
          <CardMedia
            component="img"
            image={getImageUrl(photo.file_name)}
            alt="User post"
            sx={{
              height: "auto",
              maxHeight: "600px",
              objectFit: "contain",
              backgroundColor: "#f9f9f9",
            }}
          />

          <CardContent>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
              Bình luận ({photo.comments?.length || 0})
            </Typography>
            <Divider sx={{ mb: 1.5 }} />

            {/* Danh sách bình luận */}
            {!photo.comments || photo.comments.length === 0 ? (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 2 }}
              >
                Chưa có bình luận nào. Hãy là người đầu tiên để lại ý kiến!
              </Typography>
            ) : (
              photo.comments.map((c) => (
                <Box
                  key={c._id}
                  sx={{ mb: 1.5, pb: 1, borderBottom: "1px solid #f0f0f0" }}
                >
                  <Typography variant="body2">
                    <Link
                      to={`/users/${c.user_id?._id}`}
                      style={{
                        textDecoration: "none",
                        fontWeight: "bold",
                        color: "#1976d2",
                      }}
                    >
                      {c.user_id?.first_name} {c.user_id?.last_name}
                    </Link>

                    <Box
                      component="span"
                      sx={{ fontSize: "0.75rem", ml: 1.5, color: "text.secondary" }}
                    >
                      {new Date(c.date_time).toLocaleString("vi-VN")}
                    </Box>
                  </Typography>

                  <Typography variant="body2" sx={{ mt: 0.5, color: "#333" }}>
                    {c.comment}
                  </Typography>
                </Box>
              ))
            )}

            {/* Ô nhập bình luận */}
            <Box
              sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}
            >
              <TextField
                label="Viết bình luận của bạn..."
                multiline
                rows={2}
                variant="outlined"
                size="small"
                fullWidth
                value={commentTexts[photo._id] || ""}
                onChange={(e) => handleTextChange(photo._id, e.target.value)}
              />
              <Button
                variant="contained"
                size="small"
                sx={{ alignSelf: "flex-end", textTransform: "none" }}
                onClick={() => handleAddComment(photo._id)}
                disabled={
                  !commentTexts[photo._id] || !commentTexts[photo._id].trim()
                }
              >
                Gửi bình luận
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default UserPhotos;
