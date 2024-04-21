import express from "express";

import { getPosts, createPost } from "../controller/posts.js";

const router = express.Router();

// https://localhost:5000/posts/
router.get("/", getPosts
//  (req, res) => {
//   res.send("This Works");
// }
);

router.post("/", createPost)

export default router;
