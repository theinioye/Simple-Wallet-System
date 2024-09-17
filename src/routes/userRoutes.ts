import express,{Request,Response} from  "express"
import { createUser,userLogIn,userDashbord } from "../controllers/userControllers"

import { authenticateToken,validateData } from "./middleware/middleware"

import { userLogInSchema,userSignUpSchema } from "./schemas/userschemas"


const userRouter = express.Router()


userRouter.post("/users", validateData(userSignUpSchema),createUser)
userRouter.post ("/users/logIn", validateData(userLogInSchema),userLogIn)
userRouter.get("/users/home", authenticateToken,userDashbord)

export default userRouter