-- AlterTable
ALTER TABLE `payments` ADD COLUMN `security_code_hash` VARCHAR(255) NULL,
    ADD COLUMN `security_code_expires_at` DATETIME(6) NULL,
    ADD COLUMN `security_code_attempts` INTEGER NOT NULL DEFAULT 0;