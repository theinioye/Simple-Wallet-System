import bcrypt from "bcrypt";
import { prisma } from "../../prisma";
import { generateAcccountNumber } from "../../accountNumber";

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
