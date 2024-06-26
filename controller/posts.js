// we do not want to write the logic insite the routes and
// therefore write all the logic here and use it in routes

import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js"; //give acces to model

export const getPosts = async (req, res) => {
  // res.send("This Works");
  try {
    const postMessages = await PostMessage.find(); //async action takes time
    // console.log(postMessages);
    res.status(200).json(postMessages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  //   res.send("Post creation");
  const post = req.body;
  const newPost = new PostMessage({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });
  try {
    await newPost.save(); //async action
    res.status(200).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// /post/123 //123 will fill the value of id
export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;

  // check validity
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("No post with that Id");
  }
  const updatedPost = await PostMessage.findByIdAndUpdate(
    _id,
    { ...post, _id },
    {
      new: true,
    }
  );
  res.json(updatedPost);
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with that id");
  await PostMessage.findByIdAndDelete(id);
  res.json({ message: "Post deleted successfully" });
};

export const likePost = async (req, res) => {
  const { id } = req.params;
  // req.userId will be present because we have added it in middle ware
  if (!req.userId) return res.json({ message: "Unauthenticated" });
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);
  const post = await PostMessage.findById(id);
  const index = post.likes?.findIndex((id) => id === String(req.userId));
  if (index === -1) {
    // this user has not liked the post
    post.likes.push(req.userId);
  } else {
    // unlike, keep all the like except of the user
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }
  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  });
  res.json(updatedPost);
};
