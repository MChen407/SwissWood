-- Suppression des produits existants (anciennes essences Teck/Iroko/Pin/Sapin),
-- cascade sur les relations (reviews, favorites, order_items, etc.).
DELETE FROM `products`;

-- Remplacement de l'enum des essences par les 23 essences de bois de chauffage,
-- réparties en 3 groupes : feuillus durs, feuillus mi-durs, résineux & feuillus tendres.
ALTER TABLE `products`
    MODIFY `essence` ENUM(
        'Chene', 'Charme', 'Hetre', 'Frene', 'Orme', 'Erable', 'Noyer', 'Olivier',
        'Chataignier', 'Acacia', 'Bouleau', 'Merisier', 'ArbresFruitiers', 'Robinier',
        'Peuplier', 'Aulne', 'Tilleul', 'Saule', 'Platane', 'Pin', 'Sapin', 'Epicea', 'Meleze'
    ) NOT NULL;
