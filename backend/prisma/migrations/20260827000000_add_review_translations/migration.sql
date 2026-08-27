-- Traductions optionnelles pour les avis produits.
-- Le champ `comment` reste la valeur par défaut en français ;
-- `translations` stocke { en: { comment }, es: {...}, de: {...} }.

ALTER TABLE `product_reviews` ADD COLUMN `translations` JSON NOT NULL DEFAULT('{}');