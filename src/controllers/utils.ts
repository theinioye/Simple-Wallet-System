import bcrypt from "bcrypt";
import { prisma } from "../../prisma";
import { generateAcccountNumber } from "../../accountNumber";
import jwt from "jsonwebtoken";
import { MY_SECRET_KEY } from "../../key";
import { Request, Response } from "express";


export async function encodeString(string: string) {
  const saltRounds = 10;
  const encodedString = await bcrypt.hash(string, saltRounds);
  return encodedString;
}

type user = {
  name: string;
  email: string;
  password: string;
};

export async function makeUser(data: user) {
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: await encodeString(data.password),
      walletBalance: 10000.0,
      accountNumber: String(await generateAcccountNumber()),
    },
  });

  return user;
}

type userdata = {
  name: string;
  email: string;
};
export async function findUser(data: userdata) {
  const user = await prisma.user.findUnique({
    where: {
      name: data.name,
      email: data.email,
    },
  });
  return user;
}

export async function compareHash(password: string, hash: string) {
  const compare = bcrypt.compare(password, hash);
  return compare;
}

export async function createToken(user: any) {
  const token = jwt.sign(
    { walletId: user.walletId, name: user.name },
    MY_SECRET_KEY,
    {
      expiresIn: "5m",
    }
  );
return token
}

export function errorMessage (){
    return{
        message: "Please include a name or username to sign in ",
      }
}