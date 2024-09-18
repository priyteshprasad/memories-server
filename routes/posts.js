import express from "express";

import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getPostsBySearch,
} from "../controller/posts.js";
import auth from "../middleware/auth.js";
const router = express.Router();

// https://localhost:5000/posts/
router.get(
  "/",
  getPosts
  //  (req, res) => {
  //   res.send("This Works");
  // }
);
// all of the routes begain with /posts
router.get('/search', getPostsBySearch)

router.post("/", auth, createPost);

router.patch("/:id", auth, updatePost); //patch is used to update
//we need to id of existing post
router.delete("/:id", auth, deletePost);

router.patch("/:id/likePost", auth, likePost); //liking only once

export default router;
