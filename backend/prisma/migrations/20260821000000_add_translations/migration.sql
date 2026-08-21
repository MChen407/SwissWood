-- Traductions optionnelles pour les produits et le contenu CMS.
-- Les colonnes existantes (name, description, value) restent les valeurs
-- par défaut en français ; `translations` stocke { en: {...}, es: {...}, de: {...} }.

ALTER TABLE `products` ADD COLUMN `translations` JSON NOT NULL DEFAULT('{}');

ALTER TABLE `cms_content` ADD COLUMN `translations` JSON NOT NULL DEFAULT('{}');
