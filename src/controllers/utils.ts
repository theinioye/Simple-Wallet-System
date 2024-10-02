import bcrypt from "bcrypt";
import { prisma } from "../../prisma";
import { generateAcccountNumber } from "../../accountNumber";
import jwt from "jsonwebtoken";
import { MY_SECRET_KEY } from "../../key";
import { Request, Response } from "express";
import { Decimal } from "@prisma/client/runtime/library";
import { optional } from "zod";

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
  return token;
}

export function signInError() {
  return {
    message: "No name or username included ",
  };
}

export async function findUniqueUser(walletId?: any, accountNumber?: any) {
  const sender = await prisma.user.findUnique({
    where: {
      walletId,
      accountNumber,
    },
  });
  return sender;
}
export function logInMessage() {
  return {
    message: `Log in successful`,
  };
}
export function LogInBalance(name: any, balance: Decimal) {
  return {
    message: `${name}, ${balance}`,
  };
}

export function userError() {
  return {
    message: "user not found",
  };
}
export function passwordError() {
  return {
    message:
      "Email,name or password incorrect. Please check log in details and try again",
  };
}
export function dashboardMessage(name: any) {
  return {
    message: `Welcome to your dashboard, ${name}.`,
  };
}
type transaction = {
  amount: any;
  receiverAccountNumber: any;
  senderAccountNumber: string;
};
export async function createTransaction(data: transaction) {
  const transaction = await prisma.transaction.create({
    data: {
      amount: data.amount,
      receiverAccountNumber: data.receiverAccountNumber,
      senderAccountNumber: data.senderAccountNumber,
    },
  });
  return transaction;
}

export async function retrieveTransactionHistory(accountNumber: string) {
  const transactionHistory = await prisma.transaction.findMany({
    where: {
      OR: [
        { senderAccountNumber: accountNumber },
        { receiverAccountNumber: accountNumber },
      ],
    },
  });
  return transactionHistory;
}

export async function updateBalance(accountNumber: any, walletBalance: any) {
  await prisma.user.update({
    where: {
      accountNumber,
    },
    data: {
      walletBalance,
    },
  });
}
