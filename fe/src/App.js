import React, { useState } from "react";
import { Grid, Paper, Box } from "@mui/material";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import Register from "./components/Register";
import Login from "./components/Login";
import UserComments from "./components/UserComments";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [photoTrigger, setPhotoTrigger] = useState(false);

  const handleLoginSuccess = (loggedInUser) => {
    setIsLoggedIn(true);
    setUser(loggedInUser);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  };

  const handleUploadSuccess = () => {
    setPhotoTrigger((prev) => !prev);
  };

  const userHomePath = user ? `/users/${user._id}` : "/";

  return (
    <Router>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TopBar
            isLoggedIn={isLoggedIn}
            user={user}
            onLogout={handleLogout}
            onUploadSuccess={handleUploadSuccess}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ height: "64px", width: "100%" }} />
        </Grid>

        {isLoggedIn ? (
          /* --- GIAO DIỆN ĐĂNG NHẬP --- */
          <>
            <Grid item sm={3}>
              <Paper variant="outlined" sx={{ padding: 2, minHeight: "80vh" }}>
                <UserList photoTrigger={photoTrigger} />
              </Paper>
            </Grid>

            <Grid item sm={9}>
              <Paper variant="outlined" sx={{ padding: 2, minHeight: "80vh" }}>
                <Routes>
                  <Route path="/" element={<Navigate to={userHomePath} />} />
                  <Route path="/users/:userId" element={<UserDetail />} />

                  <Route
                    path="/photos/:userId"
                    element={
                      <UserPhotos
                        photoTrigger={photoTrigger}
                        onUploadSuccess={handleUploadSuccess}
                      />
                    }
                  />

                  <Route path="/comments/:userId" element={<UserComments />} />

                  <Route
                    path="/login"
                    element={<Navigate to={userHomePath} />}
                  />
                  <Route
                    path="/register"
                    element={<Navigate to={userHomePath} />}
                  />
                  <Route path="*" element={<Navigate to={userHomePath} />} />
                </Routes>
              </Paper>
            </Grid>
          </>
        ) : (
          /* --- GIAO DIỆN CHƯA ĐĂNG NHẬP --- */
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ padding: 2, minHeight: "80vh" }}>
              <Routes>
                <Route
                  path="/login"
                  element={<Login onLoginSuccess={handleLoginSuccess} />}
                />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Router>
  );
};

export default App;
