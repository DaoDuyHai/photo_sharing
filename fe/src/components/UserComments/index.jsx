import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, CircularProgress, Divider } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import { getImageUrl } from "../../config";

function UserComments() {
  const { userId } = useParams();
  const [commentsList, setCommentsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetchModel(`/api/user/commentsOfUser/${userId}`);
        setCommentsList(res.data || []);
      } catch (err) {
        console.error("Lỗi tải bình luận:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [userId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
        <CircularProgress size={35} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
        Lịch sử bình luận ({commentsList.length})
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {commentsList.length === 0 ? (
        <Typography color="text.secondary">
          Người dùng này chưa có bình luận nào trên hệ thống.
        </Typography>
      ) : (
        commentsList.map((item, index) => (
          <Paper
            key={index}
            variant="outlined"
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1.5,
              mb: 1.5,
              borderRadius: 2,
              transition: "background 0.2s",
              "&:hover": { backgroundColor: "#fbfbfb" },
            }}
          >
            <Link to={`/photos/${item.photoUserId}`}>
              <Box
                component="img"
                src={getImageUrl(item.photoFile)}
                alt="thumbnail"
                sx={{
                  width: 64,
                  height: 64,
                  objectFit: "cover",
                  borderRadius: 1,
                  mr: 2,
                  border: "1px solid #e0e0e0",
                }}
              />
            </Link>

            <Box sx={{ flex: 1 }}>
              <Link
                to={`/photos/${item.photoUserId}`}
                style={{
                  color: "#1976d2",
                  textDecoration: "none",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                }}
              >
                "{item.commentText}"
              </Link>
              <Typography
                variant="caption"
                display="block"
                sx={{ color: "text.secondary", mt: 0.5 }}
              >
                Thời gian: {new Date(item.dateTime).toLocaleString("vi-VN")}
              </Typography>
            </Box>
          </Paper>
        ))
      )}
    </Box>
  );
}

export default UserComments;
