// we do not want to write the logic insite the routes and
// therefore write all the logic here and use it in routes

import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js"; //give acces to model

export const getPosts = async (req, res) => {
  // res.send("This Works");
  const { page } = req.query;

  try {
    const LIMIT = 8;
    const startIndex = (Number(page) - 1) * LIMIT; //get the starting index of every page; //-1 bcos, we get 0-7 memories at 0th index, and at 1st index we will memories form 8th index to 15th index
    const total = await PostMessage.countDocuments({});
    const posts = await PostMessage.find() //implement .filter({isDeleted: false})
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex); //async action takes time
    // console.log(postMessages);
    res.status(200).json({
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT), // total memories/ memories per page
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// query=> /posts?page=1 -> page = 1 ; when we want to query and result can change
// params=> /posts/123 -> id=123 ; when we want ot get a specific data
export const getPostsBySearch = async (req, res) => {
  // console.log("line34", req.query)
  const { searchQuery, tags } = req.query;
  
  try {
    const title = new RegExp(searchQuery, "i"); //i stands for ignore case: test Test tEST all are same; regex helps mongo to search
    const posts = await PostMessage.find({
      $or: [{ title }, { tags: { $in: tags.split(",") } }],
    }); //$or: either match any object in array //$in: any value of key if present in the recieved array
    res.json({ data: posts });
  } catch (error) {
    console.log("error", error)
    res.status(404).json({ message: error.message });
  }
};

export const getPost = async (req, res) => {
  const {id} = req.params;
  try {
    const post = await PostMessage.findById(id)
    res.status(200).json(post)
  } catch (error) {
    res.status(404).json({message: error.message})
  }
}

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

export const commentPost  = async (req, res) =>{
  const {id} = req.params;
  const {value} = req.body;
  const post = await PostMessage.findById(id)
  post.comments.push(value);
  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true})
  res.json(updatedPost)
}