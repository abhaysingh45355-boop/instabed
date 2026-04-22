-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'HOSPITAL_ADMIN', 'STAFF');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('BASIC', 'PRO', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STAFF',
    "hospital_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hospital" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "registration_number" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "contact_number" TEXT NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "subscription_plan" "SubscriptionPlan" NOT NULL DEFAULT 'BASIC',
    "subscription_status" "SubscriptionStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hospital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BedAvailability" (
    "id" TEXT NOT NULL,
    "hospital_id" TEXT NOT NULL,
    "total_general" INTEGER NOT NULL DEFAULT 0,
    "available_general" INTEGER NOT NULL DEFAULT 0,
    "total_icu" INTEGER NOT NULL DEFAULT 0,
    "available_icu" INTEGER NOT NULL DEFAULT 0,
    "total_ventilator" INTEGER NOT NULL DEFAULT 0,
    "available_ventilator" INTEGER NOT NULL DEFAULT 0,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT,

    CONSTRAINT "BedAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OxygenInventory" (
    "id" TEXT NOT NULL,
    "hospital_id" TEXT NOT NULL,
    "total_cylinders" INTEGER NOT NULL DEFAULT 0,
    "cylinders_available" INTEGER NOT NULL DEFAULT 0,
    "flow_rate_lpm" INTEGER NOT NULL DEFAULT 0,
    "pipeline_status" BOOLEAN NOT NULL DEFAULT true,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT,

    CONSTRAINT "OxygenInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BloodInventory" (
    "id" TEXT NOT NULL,
    "hospital_id" TEXT NOT NULL,
    "blood_group" TEXT NOT NULL,
    "units_available" INTEGER NOT NULL DEFAULT 0,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT,

    CONSTRAINT "BloodInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIChatHistory" (
    "id" TEXT NOT NULL,
    "user_session_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIChatHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "details" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hospital" TEXT,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_hospital_id_idx" ON "User"("hospital_id");

-- CreateIndex
CREATE UNIQUE INDEX "Hospital_registration_number_key" ON "Hospital"("registration_number");

-- CreateIndex
CREATE UNIQUE INDEX "BedAvailability_hospital_id_key" ON "BedAvailability"("hospital_id");

-- CreateIndex
CREATE INDEX "BedAvailability_hospital_id_idx" ON "BedAvailability"("hospital_id");

-- CreateIndex
CREATE UNIQUE INDEX "OxygenInventory_hospital_id_key" ON "OxygenInventory"("hospital_id");

-- CreateIndex
CREATE INDEX "OxygenInventory_hospital_id_idx" ON "OxygenInventory"("hospital_id");

-- CreateIndex
CREATE INDEX "BloodInventory_hospital_id_idx" ON "BloodInventory"("hospital_id");

-- CreateIndex
CREATE INDEX "BloodInventory_blood_group_idx" ON "BloodInventory"("blood_group");

-- CreateIndex
CREATE UNIQUE INDEX "BloodInventory_hospital_id_blood_group_key" ON "BloodInventory"("hospital_id", "blood_group");

-- CreateIndex
CREATE INDEX "AIChatHistory_user_session_id_idx" ON "AIChatHistory"("user_session_id");

-- CreateIndex
CREATE INDEX "AuditLog_user_id_idx" ON "AuditLog"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE INDEX "PasswordResetToken_token_idx" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE INDEX "PasswordResetToken_user_id_idx" ON "PasswordResetToken"("user_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "Hospital"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BedAvailability" ADD CONSTRAINT "BedAvailability_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OxygenInventory" ADD CONSTRAINT "OxygenInventory_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodInventory" ADD CONSTRAINT "BloodInventory_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
