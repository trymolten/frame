-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('IDLE', 'GENERATING', 'READY', 'FAILED');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'IDLE';
