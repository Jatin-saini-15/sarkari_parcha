-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_test_attempts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mockTestId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "attemptNumber" INTEGER NOT NULL DEFAULT 1,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME,
    "totalQuestions" INTEGER NOT NULL,
    "attemptedQuestions" INTEGER NOT NULL DEFAULT 0,
    "correctAnswers" INTEGER NOT NULL DEFAULT 0,
    "wrongAnswers" INTEGER NOT NULL DEFAULT 0,
    "skippedQuestions" INTEGER NOT NULL DEFAULT 0,
    "totalMarks" INTEGER NOT NULL DEFAULT 0,
    "percentage" REAL NOT NULL DEFAULT 0,
    "timeTaken" INTEGER,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "test_attempts_mockTestId_fkey" FOREIGN KEY ("mockTestId") REFERENCES "mock_tests" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "test_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_test_attempts" ("attemptedQuestions", "correctAnswers", "createdAt", "endTime", "id", "isCompleted", "mockTestId", "percentage", "skippedQuestions", "startTime", "timeTaken", "totalMarks", "totalQuestions", "updatedAt", "userId", "wrongAnswers") SELECT "attemptedQuestions", "correctAnswers", "createdAt", "endTime", "id", "isCompleted", "mockTestId", "percentage", "skippedQuestions", "startTime", "timeTaken", "totalMarks", "totalQuestions", "updatedAt", "userId", "wrongAnswers" FROM "test_attempts";
DROP TABLE "test_attempts";
ALTER TABLE "new_test_attempts" RENAME TO "test_attempts";
CREATE UNIQUE INDEX "test_attempts_mockTestId_userId_attemptNumber_key" ON "test_attempts"("mockTestId", "userId", "attemptNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
