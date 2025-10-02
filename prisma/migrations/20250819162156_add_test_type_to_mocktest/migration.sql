-- CreateTable
CREATE TABLE "test_series" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "test_series_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "exam_categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "amount" REAL,
    "currency" TEXT,
    "paymentId" TEXT,
    "orderId" TEXT,
    "couponCode" TEXT,
    "couponType" TEXT,
    "isAutoRenew" BOOLEAN NOT NULL DEFAULT false,
    "cancelledAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PremiumConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "subscriptionDurationDays" INTEGER NOT NULL DEFAULT 90,
    "originalPrice" REAL NOT NULL DEFAULT 499,
    "discountPercentage" REAL NOT NULL DEFAULT 100,
    "couponCode" TEXT NOT NULL DEFAULT 'FREE499',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "admin_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "defaultFreeDuration" INTEGER NOT NULL DEFAULT 90,
    "defaultPremiumDuration" INTEGER NOT NULL DEFAULT 365,
    "promotionalMessage" TEXT NOT NULL DEFAULT 'Limited Time Offer: All Exams Test Series for 1 Year @ ₹0',
    "isPromotionActive" BOOLEAN NOT NULL DEFAULT true,
    "maxFreeTrials" INTEGER NOT NULL DEFAULT 1,
    "referralBonus" INTEGER NOT NULL DEFAULT 30,
    "heroBannerMessage" TEXT,
    "isHeroBannerActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "pdf_uploads" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "originalName" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'UPLOADED',
    "processingLog" TEXT,
    "categoryId" TEXT,
    "examNameId" TEXT,
    "year" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "pdf_uploads_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "exam_categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "pdf_uploads_examNameId_fkey" FOREIGN KEY ("examNameId") REFERENCES "exam_names" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "mock_tests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "instructions" TEXT,
    "duration" INTEGER NOT NULL,
    "totalMarks" INTEGER NOT NULL,
    "negativeMarking" REAL,
    "passingMarks" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "testType" TEXT NOT NULL DEFAULT 'mock',
    "categoryId" TEXT NOT NULL,
    "examNameId" TEXT,
    "pdfUploadId" TEXT,
    "docxUploadId" TEXT,
    "folderId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "mock_tests_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "exam_categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "mock_tests_examNameId_fkey" FOREIGN KEY ("examNameId") REFERENCES "exam_names" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "mock_tests_pdfUploadId_fkey" FOREIGN KEY ("pdfUploadId") REFERENCES "pdf_uploads" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "mock_tests_docxUploadId_fkey" FOREIGN KEY ("docxUploadId") REFERENCES "docx_uploads" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "mock_tests_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "test_sections" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mockTestId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 1,
    "duration" INTEGER,
    "totalMarks" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "test_sections_mockTestId_fkey" FOREIGN KEY ("mockTestId") REFERENCES "mock_tests" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mockTestId" TEXT NOT NULL,
    "sectionId" TEXT,
    "questionNumber" INTEGER NOT NULL,
    "questionText" TEXT NOT NULL,
    "questionImage" TEXT,
    "optionA" TEXT NOT NULL,
    "optionAImage" TEXT,
    "optionB" TEXT NOT NULL,
    "optionBImage" TEXT,
    "optionC" TEXT NOT NULL,
    "optionCImage" TEXT,
    "optionD" TEXT NOT NULL,
    "optionDImage" TEXT,
    "correctOption" TEXT NOT NULL,
    "explanation" TEXT,
    "subject" TEXT,
    "difficulty" TEXT,
    "marks" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "questions_mockTestId_fkey" FOREIGN KEY ("mockTestId") REFERENCES "mock_tests" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "questions_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "test_sections" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "test_attempts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mockTestId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
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

-- CreateTable
CREATE TABLE "question_responses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "attemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "selectedOption" TEXT,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "timeTaken" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "question_responses_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "test_attempts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "question_responses_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "docx_uploads" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "originalName" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'UPLOADED',
    "processingLog" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "folders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "parentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "folders_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "folders" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_exams" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "examUrl" TEXT NOT NULL,
    "examType" TEXT NOT NULL DEFAULT 'mock',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "duration" INTEGER,
    "totalMarks" INTEGER,
    "yearId" TEXT,
    "examNameId" TEXT,
    "testSeriesId" TEXT,
    "scheduledAt" DATETIME,
    "examEndTime" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "exams_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "exam_years" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "exams_examNameId_fkey" FOREIGN KEY ("examNameId") REFERENCES "exam_names" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "exams_testSeriesId_fkey" FOREIGN KEY ("testSeriesId") REFERENCES "test_series" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_exams" ("createdAt", "description", "duration", "examNameId", "examType", "examUrl", "id", "isActive", "isFree", "slug", "title", "totalMarks", "updatedAt", "yearId") SELECT "createdAt", "description", "duration", "examNameId", "examType", "examUrl", "id", "isActive", "isFree", "slug", "title", "totalMarks", "updatedAt", "yearId" FROM "exams";
DROP TABLE "exams";
ALTER TABLE "new_exams" RENAME TO "exams";
CREATE UNIQUE INDEX "exams_yearId_slug_key" ON "exams"("yearId", "slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "test_series_categoryId_slug_key" ON "test_series"("categoryId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_type_key" ON "Subscription"("userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "pdf_uploads_fileName_key" ON "pdf_uploads"("fileName");

-- CreateIndex
CREATE UNIQUE INDEX "mock_tests_slug_key" ON "mock_tests"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "test_sections_mockTestId_order_key" ON "test_sections"("mockTestId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "questions_mockTestId_questionNumber_key" ON "questions"("mockTestId", "questionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "test_attempts_mockTestId_userId_key" ON "test_attempts"("mockTestId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "question_responses_attemptId_questionId_key" ON "question_responses"("attemptId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "docx_uploads_fileName_key" ON "docx_uploads"("fileName");

-- CreateIndex
CREATE UNIQUE INDEX "folders_slug_key" ON "folders"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "folders_parentId_name_key" ON "folders"("parentId", "name");
