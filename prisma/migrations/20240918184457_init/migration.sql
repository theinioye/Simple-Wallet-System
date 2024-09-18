-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "transactionID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" DECIMAL NOT NULL,
    "senderAccountNumber" TEXT NOT NULL,
    "receiverAccountNumber" TEXT NOT NULL,
    "dateCreated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transaction_senderAccountNumber_fkey" FOREIGN KEY ("senderAccountNumber") REFERENCES "User" ("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_receiverAccountNumber_fkey" FOREIGN KEY ("receiverAccountNumber") REFERENCES "User" ("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Transaction" ("amount", "receiverAccountNumber", "senderAccountNumber", "transactionID") SELECT "amount", "receiverAccountNumber", "senderAccountNumber", "transactionID" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
