import express from "express";
const router = express.Router();

import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

// Public Routes
router.get("/:postId", getComments);

// Protected Routes
router.post("/:postId", protectRoute, createComment);
router.put("/:commentId", protectRoute, updateComment);
router.delete("/:commentId", protectRoute, deleteComment);

export default router;
