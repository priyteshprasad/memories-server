//use posibilities of mongoos
// we create different model for the entities

import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  title: String,
  message: String,
  name: String,
  creator: String,
  tags: [String],
  selectedFile: String,
  likeCount: {
    Number,
  },
  likes: {
    type: [String],
    default: [],
  },
  comments: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const PostMessage = mongoose.model("PostMessage", postSchema); //it provide default methods like save, delete, find etc
export default PostMessage;
