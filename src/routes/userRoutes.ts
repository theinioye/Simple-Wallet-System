import express, { Request, Response } from "express";
import {
  createUser,
  userLogIn,
  userDashbord,
} from "../controllers/userControllers";

const userRouter = express.Router();

import { authenticateToken, validateData } from "./middleware/middleware";

import { userLogInSchema, userSignUpSchema } from "./schemas/userschemas";

userRouter.post("/users/signUp", validateData(userSignUpSchema), createUser);
userRouter.post("/users/logIn", validateData(userLogInSchema), userLogIn);
userRouter.get("/users/home", authenticateToken, userDashbord);

export default userRouter;
