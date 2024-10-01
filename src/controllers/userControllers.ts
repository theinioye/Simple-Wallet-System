import { Request, Response } from "express";
import { prisma } from "../../prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { MY_SECRET_KEY } from "../../key";
import { generateAcccountNumber } from "../../accountNumber";
import { compareHash, encodeString, makeUser } from "./utils";
import { findUser } from "./utils";
export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body
  
  const newUser = await makeUser({name,email,password})
  return res.status(201).json({
    message:
      "You have successfullly opened a new wallet with the following details",
    newUser,
  });
};

export const userLogIn = async (req: Request, res: Response) => {
  const { email, name, password } = req.body
  if (!email && !name) {
    return res.json({
      message: "Please include a name or username to sign in ",
    });
  }
   const user = await findUser({name,email})

  if (!user) {
    return res.json({
      message:
        "This wallet does not exist.Kindly check log in details and trye again",
    });
  }

  const passwordCheck = await compareHash(password, user.password);

  if (!passwordCheck) {
    return res.json({
      message:
        "Email,name or password incorrect. Please check log in details and try again",
    });
  } else {
    const token = 
    res.status(200).json({
      message: "Welcome.Log in Successful",
      token,
    });
  }
};

export const userDashbord = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const userId = user.walletId;
  const userWallet = await prisma.user.findUnique({
    where: {
      walletId: userId,
    },
  });
  if (!userWallet) {
    return res.status(200).json({
      message: `Welcome to your dashboard, ${user.name}.`,
    });
  }
  const walletBalance = userWallet.walletBalance;
  return res.status(200).json({
    message: `Welcome to your dashboard, ${user.name}, your wallet balance is ${walletBalance}`,
  });
};

export const sendMoney = async (req: Request, res: Response) => {
  const data = req.body;
  const { receiverAccountNumber, amount } = data;

  const user = (req as any).user;
  const userId = user.walletId;

  const sender = await prisma.user.findUnique({
    where: {
      walletId: userId,
    },
  });

  if (!sender) {
    return res.status(403).json({
      message: `This action is forbidden, reattempt sign in to reinitiate transaction`,
    });
  }

  const senderAccountNumber = sender.accountNumber;

  const receiver = await prisma.user.findUnique({
    where: {
      accountNumber: receiverAccountNumber,
    },
  });

  if (!receiver) {
    return res.status(400).json({
      message:
        " The destination acount does not exist. Kindly input a valid destination account number",
    });
  }

  const senderWalletBalance = sender.walletBalance;

  if (amount > senderWalletBalance) {
    return res.status(403).json({
      message:
        "You do not have enough balance to complete this transaction, please, fund your wallet to complete this transaction",
    });
  }

  const newSenderWalletBalance = Number(senderWalletBalance) - amount;

  const newReceiverWalletBalance = receiver.walletBalance + amount;

  await prisma.user.update({
    where: {
      accountNumber: senderAccountNumber,
    },
    data: {
      walletBalance: newSenderWalletBalance,
    },
  });

  await prisma.user.update({
    where: {
      accountNumber: receiverAccountNumber,
    },
    data: {
      walletBalance: newReceiverWalletBalance,
    },
  });

  const transaction = await prisma.transaction.create({
    data: {
      amount,
      receiverAccountNumber,
      senderAccountNumber,
    },
  });

  return res.status(200).json({
    message : `#${transaction.amount} sent sucessfully to ${receiver.name}`
  })
}

 export const viewTransactions = async (req:Request, res: Response) => {
  const user = (req as any).user
  const walletId = user.walletId
  const userWallet = await prisma.user.findUnique({
    where : {
      walletId,
    }
  })
  if (!userWallet){
    return res.status(400).json({
      message: `User not recognized,reinitiate log In`
    })
  }

 const accountNumber = userWallet.accountNumber
 
 const transactionHistory = await prisma.transaction.findMany({
  where:{
    OR :[
    {senderAccountNumber: accountNumber},
    {receiverAccountNumber: accountNumber},

    ],
  },
 })


 return res.json({transactionHistory})

 }
 
