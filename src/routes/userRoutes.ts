import express, { Request, Response } from "express";
import {
  createUser,
  userLogIn,
  userDashbord,
  sendMoney,
  viewTransactions
} from "../controllers/userControllers";

const userRouter = express.Router();

import { authenticateToken, validateData } from "./middleware/middleware";

import { userLogInSchema, userSignUpSchema, transactionSchema  } from "./schemas/userschemas";

userRouter.post("/users/signUp", validateData(userSignUpSchema), createUser);
userRouter.post("/users/logIn", validateData(userLogInSchema), userLogIn);
userRouter.get("/users/home", authenticateToken, userDashbord);
userRouter.post("/users/send", authenticateToken,validateData(transactionSchema),sendMoney)
userRouter.get("/users/history", authenticateToken,viewTransactions)
export default userRouter;
