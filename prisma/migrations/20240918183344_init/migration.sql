/*
  Warnings:

  - You are about to drop the column `receiverId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `receiverAccountNumber` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderAccountNumber` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "transactionID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" DECIMAL NOT NULL,
    "senderAccountNumber" TEXT NOT NULL,
    "receiverAccountNumber" TEXT NOT NULL,
    CONSTRAINT "Transaction_senderAccountNumber_fkey" FOREIGN KEY ("senderAccountNumber") REFERENCES "User" ("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_receiverAccountNumber_fkey" FOREIGN KEY ("receiverAccountNumber") REFERENCES "User" ("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Transaction" ("amount", "transactionID") SELECT "amount", "transactionID" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
