import express from "express";
import {
  getAllUser,
  getDetailUser,
  getUserComments,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/list", getAllUser);

router.get("/:id", getDetailUser);
router.get("/commentsOfUser/:id", getUserComments);

export default router;
