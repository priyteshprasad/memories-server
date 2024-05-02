import express from "express";

import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
} from "../controller/posts.js";

const router = express.Router();

// https://localhost:5000/posts/
router.get(
  "/",
  getPosts
  //  (req, res) => {
  //   res.send("This Works");
  // }
);

router.post("/", createPost);

router.patch("/:id", updatePost); //patch is used to update
//we need to id of existing post
router.delete("/:id", deletePost);

router.patch("/:id/likePost", likePost);

export default router;
