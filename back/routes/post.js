// Import
import express from "express";
import { auth } from "../middleware/auth.js";
import { multer } from "../middleware/multer-config.js";
import {
  createPost,
  getAllPosts,
  deletePost,
  modifyPost,
  getPicture,
} from "../controllers/post.js";

// Variables
const postRoad = express.Router();

// Routes
postRoad.post("/post", auth, multer, createPost);
postRoad.get("/allpost", auth, getAllPosts);
postRoad.delete("/:id", auth, deletePost);
postRoad.put("/:id", auth, modifyPost);
postRoad.get("/image/:id", auth, multer, getPicture);

// Export
export default postRoad;
