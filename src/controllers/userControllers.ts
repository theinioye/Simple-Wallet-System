import { Request, Response } from "express";
import {
  compareHash,
  createToken,
  passwordError,
  dashboardMessage,
  signInError,
  findUniqueUser,
  LogInBalance,
  makeUser,
  userError,
  createTransaction,
  retrieveTransactionHistory,
  updateBalance,
  findUser
} from "./utils";


export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const newUser = await makeUser({ name, email, password });
  return res.status(201).json({
    message:
      "You have successfullly opened a new wallet with the following details",
    newUser,
  });
};

export const userLogIn = async (req: Request, res: Response) => {
  const { email, name, password } = req.body;
  if (!email && !name) {
    return res.json(signInError);
  }
  const user = await findUser({ name, email });

  if (!user) {
    return res.json(userError);
  }

  if (!(await compareHash(password, user.password))) {
    return res.json(passwordError());
  } else {
    const token = await createToken(user);
    res.status(200).json({
      message: "Log in Successful",
      token,
    });
  }
};

export const userDashbord = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const userWallet = await findUniqueUser(user.walletId);

  if (!userWallet) {
    return res.status(200).json(dashboardMessage(user.name));
  }
  return res
    .status(200)
    .json(LogInBalance(user.name, userWallet.walletBalance));
};

export const sendMoney = async (req: Request, res: Response) => {
  const { receiverAccountNumber, amount } = req.body;

  const user = (req as any).user;

  const sender = await findUniqueUser(user.walletId);

  if (!sender) {
    return res.status(403).json(userError());
  }

  const senderAccountNumber = sender.accountNumber;

  const receiver = await findUniqueUser(receiverAccountNumber);

  if (!receiver) {
    return res.status(400).json(userError);
  }

  const senderWalletBalance = sender.walletBalance;

  if (amount > senderWalletBalance) {
    return res.status(403).json({
      message:
        "You do not have enough balance to complete this transaction, please, fund your wallet to complete this transaction",
    });
  }

  const newSenderWalletBalance = Number(senderWalletBalance) - amount;

  const newReceiverWalletBalance = Number(receiver.walletBalance) + amount;

  await updateBalance(senderAccountNumber, newSenderWalletBalance);

  await updateBalance(receiverAccountNumber, newReceiverWalletBalance);

  const transaction = await createTransaction({
    amount,
    receiverAccountNumber,
    senderAccountNumber,
  });

  return res.status(200).json({
    message: `#${transaction.amount} sent sucessfully to ${receiver.name}`,
  });
};

export const viewTransactions = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const userWallet = await findUniqueUser(user.walletId);
  if (!userWallet) {
    return res.status(400).json(userError);
  }
  const transactionHistory = retrieveTransactionHistory(
    userWallet.accountNumber
  );
  return res.json({ transactionHistory });
};
