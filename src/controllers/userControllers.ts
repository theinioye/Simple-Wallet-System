import {Request, Response } from "express"
import {prisma} from "../../prisma"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {MY_SECRET_KEY} from "../../key"

export const createUser = async (req:Request,res: Response) => {
    const data = req.body
const {name,email,password} = data 

const saltRounds = 15
const hashedPassword = await bcrypt.hash(password,saltRounds)
const newUser = await prisma.user.create ({
    data:{
        name,email,
        password : hashedPassword,
        walletBalance : 100000.00
    }
})
return res.status(201).json ({
    message: "You have successfullly opened a new wallet with the following details",
    newUser,
})

}

export const userLogIn = async (req:Request , res: Response) => {
    const data = req.body
    const { email,name,password} = data
    if (!email && !name) {
        return res.json({
            message:"Please include a name or username to sign in "
        })
    }
        const user = await prisma.user.findUnique({
            where: { 
                name,email
            
            }
        })

        if(!user) {
            return res.json({
                message : "This wallet does not exist.Kindly check log in details and trye again"
            })
        }

        const passwordCheck = bcrypt.compare(password,user.password)

        if (!passwordCheck) {
            return res.json ({
                message: "Email,name or password incorrect. Please check log in details and try again"

            })
            
        } else {
            const token = jwt.sign({id:user.walletId,name : user.name}, MY_SECRET_KEY,{
                expiresIn : "5m"
            })
            res.status(200).json({
                message: "Welcome.Log in Successful",token
            })
        }

     
}
export const userDashbord = (req: Request, res: Response) => {
    const user = (req as any).user
    return res.status(200).json({
        message: `Welcome to your dashboard, ${user.name}, your wallet balance is ${user.walletBalance}`
    })
}
