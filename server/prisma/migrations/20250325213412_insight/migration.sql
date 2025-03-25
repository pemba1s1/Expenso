/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "SubscriptionInterval" AS ENUM ('MONTH', 'SEMI_ANNUAL', 'YEAR');

-- CreateEnum
CREATE TYPE "StripePlanName" AS ENUM ('BASIC', 'PREMIUM_MONTHLY', 'PREMIUM_SEMI_ANNUALLY', 'PREMIUM_ANNUALLY', 'BUSINESS_PREMIUM_MONTHLY', 'BUSINESS_PREMIUM_SEMI_ANNUALLY', 'BUSINESS_PREMIUM_ANNUALLY');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "stripeSubscriptionId" TEXT,
ADD COLUMN     "subscriptionEndDate" TIMESTAMP(3),
ADD COLUMN     "subscriptionInterval" "SubscriptionInterval",
ADD COLUMN     "subscriptionPlan" "UserRole" NOT NULL DEFAULT 'BASIC',
ADD COLUMN     "subscriptionStartDate" TIMESTAMP(3),
ADD COLUMN     "subscriptionStatus" TEXT,
ADD COLUMN     "totalAllowedBusinessGroupMember" TEXT,
ALTER COLUMN "name" SET NOT NULL;

-- CreateTable
CREATE TABLE "StripePlan" (
    "id" TEXT NOT NULL,
    "name" "StripePlanName" NOT NULL,
    "description" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "type" "UserRole" NOT NULL,
    "interval" "SubscriptionInterval" NOT NULL,
    "priceId" TEXT NOT NULL,

    CONSTRAINT "StripePlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Insight" (
    "date" TIMESTAMP(3) NOT NULL,
    "groupId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "topCategories" TEXT NOT NULL,
    "tips" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Insight_pkey" PRIMARY KEY ("date")
);

-- AddForeignKey
ALTER TABLE "Insight" ADD CONSTRAINT "Insight_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
