import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import postRoutes from "./routes/posts.js"; //.js is required
import userRoutes from "./routes/users.js";
import dotenv from "dotenv";
// const express = require('express'); // not in use as above method is better
const app = express();
dotenv.config();

//General Setup
app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true })); //sending images
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
//all this so that we can send the request properly

// Routes setup //shou;d always below app.use(cors())
app.use("/posts", postRoutes); //it means ever route in posts will start from localhost://posts/myRout
app.use("/user", userRoutes);
// we gonna use the mondodb atlas cloud to store the data
// user - priytesh |  password: priytesh123

// const CONNECTION_URL =
//   "mongodb+srv://priytesh:priytesh123@cluster0.nxqtwhz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const PORT = process.env.PORT || 8000;

mongoose
  .connect(process.env.CONNECTION_URL) //make connection //, {userNewUrlParser: true, useUnifiedTopology: true} depricated
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))
  ) //on successfull connection
  .catch((error) => console.log(error.message)); // on Failure

// mongoose.set("useFindAndModify", false); //to avoid error in console
