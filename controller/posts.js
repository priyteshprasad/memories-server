// we do not want to write the logic insite the routes and
// therefore writ all the logic here and use it in routes

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
    res.status(200).json(newPost)
} catch (error) {
    res.status(409).json({message: error.message})
}
};
