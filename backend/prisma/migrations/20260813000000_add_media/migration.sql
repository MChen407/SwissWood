-- CreateTable
CREATE TABLE `media` (
    `id` CHAR(36) NOT NULL,
    `filename` VARCHAR(255) NOT NULL,
    `mimetype` VARCHAR(100) NOT NULL,
    `size` INTEGER NOT NULL,
    `data` LONGBLOB NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `media_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
