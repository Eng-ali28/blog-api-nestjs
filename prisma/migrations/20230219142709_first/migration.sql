-- CreateEnum
CREATE TYPE "Role" AS ENUM ('User', 'Admin', 'Owner');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'User';
