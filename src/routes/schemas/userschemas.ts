import {z}  from "zod"

export const userSignUpSchema  = z.object({
    name : z.string().min(4),
    email : z.string().email(),
    password : z.string().min(6),
})

export const userLogInSchema = z.object ({
    name : z.string().min(4).optional(),
    email : z.string().email().optional(),
    password : z.string().min(6)
})
