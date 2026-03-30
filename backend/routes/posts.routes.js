import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  getUserPosts,
  likePost,
  updatePost,
} from "../controllers/post.controller.js";
const router = express.Router();

// Public Routes
router.get("/", getPosts);
router.get("/:username", getUserPosts);
router
  .route("/:postId")
  .get(getPost)
  .put(protectRoute, updatePost) // Protected
  .delete(protectRoute, deletePost); // Protected

// Private Routes
router.post("/", protectRoute, upload.single("image"), createPost);
router.post("/:postId/like", protectRoute, likePost);

export default router;
