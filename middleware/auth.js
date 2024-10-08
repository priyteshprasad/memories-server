import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// user wants to like a post
// click the like button => auth middleware =>confirms => (NEXT) => like controller
const auth = async (req, res, next) => {
  try {
    // console.log("hello", req.headers);
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;

    let decodedData;
    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, "test");
      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);
      req.userId = decodedData?.sub;
    }
    next();
  } catch (error) {
    res.send()
    console.log(error);
  }
};
export default auth;
