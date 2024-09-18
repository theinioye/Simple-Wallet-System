/*
  Warnings:

  - You are about to alter the column `accountNumber` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "walletId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "accountNumber" BIGINT NOT NULL,
    "walletBalance" DECIMAL NOT NULL,
    "dateCreated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("accountNumber", "dateCreated", "email", "name", "password", "walletBalance", "walletId") SELECT "accountNumber", "dateCreated", "email", "name", "password", "walletBalance", "walletId" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_accountNumber_key" ON "User"("accountNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
