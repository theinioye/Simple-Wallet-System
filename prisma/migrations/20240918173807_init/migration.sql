/*
  Warnings:

  - Added the required column `accountNumber` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "walletId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "accountNumber" INTEGER NOT NULL,
    "walletBalance" DECIMAL NOT NULL,
    "dateCreated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("dateCreated", "email", "name", "password", "walletBalance", "walletId") SELECT "dateCreated", "email", "name", "password", "walletBalance", "walletId" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_accountNumber_key" ON "User"("accountNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
