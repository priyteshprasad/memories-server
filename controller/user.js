import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";
import { sendEmailVerificationMail } from "../utils/authUtils.js";
dotenv.config();

export const signin = async (req, res) => {
  // email and password
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(404).json({ message: "User doesn't exists." });
    if(existingUser.isEmailVerified === false){
      return res.status(400).json({message: "Please verify email before login."})
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      "test",
      { expiresIn: "1h" }
    ); //'test' is the secrete that should come from the env file
    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};
export const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;
  if ((!email || !password || !confirmPassword, !firstName || !lastName)) {
    return res.status(404).json({ message: "some values are missing" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(404).json({ message: "User already exists" });
    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords don't match" });

    const hashedPassword = await bcrypt.hash(password, 12); //12 is the level of difficulty
    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });
    const token = jwt.sign({ email: result.email, id: result._id }, "test", {
      expiresIn: "1h",
    });
    // send email logic
    sendEmailVerificationMail(email, token)
    return res.status(200).json({ success: true, result});
    // res.status(200).json({ result, token });
  } catch (error) {}
};

export const emailVerifyController = async (req, res) => {
  const token = req.params.token;
  const user = jwt.verify(token, "test"); //token doesnot required to be stored at DB because it contains the user info
  
  try {
    const userDb = await User.findOneAndUpdate(
      { email: user.email },
      { isEmailVerified: true },
      { new: true } // return object after the update
    );
    if(userDb){
      return res.send({
        status: 200,
        message: "Email Verified Successfully",
        data: userDb,
      });
    }else{
      return res.send({
        status: 500,
        message: "Email Verified Not Successfully",
        data: userDb,
      });
    }
    
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};

export const mysignup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;
  if ((!email || !password || !confirmPassword, !firstName || !lastName)) {
    return res.status(404).json({ message: "some values are missing" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(404).json({ message: "User already exists" });
    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords don't match" });

    const hashedPassword = await bcrypt.hash(password, 12); //12 is the level of difficulty
    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });
    const token = jwt.sign({ email: result.email, id: result._id }, "test", {
      expiresIn: "1h",
    });
    res.status(200).json({ result: existingUser, token });
  } catch (error) {}
};

export const testSignup = async (req, res) => {
  console.log("test signup");
  res.status(200).json({ message: "success" });
};
