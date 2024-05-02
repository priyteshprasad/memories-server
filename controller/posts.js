// we do not want to write the logic insite the routes and
// therefore write all the logic here and use it in routes

import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js"; //give acces to model

export const getPosts = async (req, res) => {
  // res.send("This Works");
  try {
    const postMessages = await PostMessage.find(); //async action takes time
    console.log(postMessages);
    res.status(200).json(postMessages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  //   res.send("Post creation");
  const post = req.body;
  const newPost = new PostMessage(post);
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
