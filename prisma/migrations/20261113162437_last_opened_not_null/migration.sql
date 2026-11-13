-- Never-opened projects sort by when they were created.
UPDATE "Project" SET "lastOpenedAt" = "createdAt" WHERE "lastOpenedAt" IS NULL;

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "lastOpenedAt" SET NOT NULL,
ALTER COLUMN "lastOpenedAt" SET DEFAULT CURRENT_TIMESTAMP;
