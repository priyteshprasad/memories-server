import express from "express";

import { getPosts, createPost, updatePost } from "../controller/posts.js";

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

router.patch("/:id", updatePost);
//we need to id of existing post

export default router;
