-- AlterTable
ALTER TABLE `orders` ADD COLUMN `shipping_fee_eur` INTEGER NOT NULL DEFAULT 0,
ADD COLUMN `shipping_weight_kg` DECIMAL(10, 2) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `shipping_fees` (
    `id` CHAR(36) NOT NULL,
    `country` VARCHAR(80) NOT NULL,
    `fee_eur` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL,

    UNIQUE INDEX `shipping_fees_country_key`(`country`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;