ALTER TABLE `products` ADD COLUMN `created_by` CHAR(36) NULL;
ALTER TABLE `products` ADD CONSTRAINT `products_created_by_fkey`
  FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
CREATE INDEX `products_created_by_idx` ON `products` (`created_by`);
