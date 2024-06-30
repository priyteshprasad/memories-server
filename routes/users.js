import express from "express";

import { signin, signup, testSignup, mysignup } from "../controller/user.js";

const router = express.Router();

router.post("/signin", signin); //send all the information to backend
router.post("/signup", signup);
router.post("/testsignup", testSignup);
router.post("/mysignup", mysignup);

export default router;
