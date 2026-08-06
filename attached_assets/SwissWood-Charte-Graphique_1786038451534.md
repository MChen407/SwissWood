# SwissWood — Charte Graphique E-commerce
### Bois de chauffage & Fourneaux | Positionnement moyen-haut de gamme

---

## Note de cadrage stratégique

Le logo existant pose déjà les fondations : bois brut (brun chaud), veinage clair (chêne/hêtre), sommets enneigés (blanc pur, montagne suisse) et une touche rouge (accent "feu/chaleur"). La charte ci-dessous prolonge cet univers en un système utilisable sur le web, pensé pour une cible **familiale, exigeante en fiabilité, sensible à la qualité perçue** — donc peu réceptive à un e-commerce "cheap" (trop de promos criardes) mais qui a besoin d'un CTA très lisible pour déclencher l'achat (produit lourd, réfléchi, souvent acheté en prévision de l'hiver).

---

## 1. Palette de couleurs

### Couleur primaire — Brun Bois (identité)
| Usage | Hex | RGB |
|---|---|---|
| Primaire foncé (headers, footer, logo) | `#4A2C1A` | 74, 44, 26 |
| Primaire standard (nav, titres, liens) | `#6B4226` | 107, 66, 38 |

**Pourquoi :** directement extrait du bois brut du logo. C'est une couleur "terrestre", perçue comme chaleureuse, artisanale et durable — cohérente avec "qualité fiable" et évite le côté froid/industriel qu'aurait un bleu ou un gris pur sur ce secteur.

### Couleur secondaire — Bois clair / Sable (support & équilibre)
| Usage | Hex | RGB |
|---|---|---|
| Secondaire (bandeaux, icônes, accents doux) | `#C89B5D` | 200, 155, 93 |
| Secondaire clair (survol, fonds de section) | `#E8D4A8` | 232, 212, 168 |

**Pourquoi :** le veinage clair du logo. Sert à créer du contraste doux avec le brun foncé sans casser l'univers bois, et donne de la respiration sur des pages produits denses.

### Couleur d'action — CTA (conversion)
| Usage | Hex | RGB |
|---|---|---|
| CTA principal (Acheter, Ajouter au panier) | `#B23A2E` | 178, 58, 46 |
| CTA hover (survol) | `#8F2E24` | 143, 46, 36 |

**Pourquoi :** repris du rouge "braise/feu" déjà présent dans le logo — donc 100% cohérent avec la marque, pas un rouge générique plaqué dessus. Sur un fond dominant brun/beige, ce rouge terracotta ressort immédiatement (fort contraste), ce qui est essentiel en CRO : le bouton d'achat doit être la couleur la plus saturée de l'écran. On le distingue volontairement du rouge d'erreur (voir plus bas) pour ne jamais créer d'ambiguïté "danger" sur un bouton d'achat.

### Couleurs de fond & neutres
| Usage | Hex | RGB |
|---|---|---|
| Fond principal (page) | `#FAF7F2` | 250, 247, 242 |
| Fond carte produit | `#FFFFFF` | 255, 255, 255 |
| Bordures / séparateurs | `#E2DCD1` | 226, 220, 209 |
| Texte principal | `#2B2420` | 43, 36, 32 |
| Texte secondaire / gris | `#7A7167` | 122, 113, 103 |

**Pourquoi :** un blanc cassé plutôt qu'un blanc pur en fond de page — plus chaud, plus "maison", évite l'effet clinique. Les cartes produits, elles, restent en blanc pur pour faire ressortir les packshots.

### Couleurs d'état
| État | Hex | RGB | Usage |
|---|---|---|---|
| Succès | `#4E7A51` | 78, 122, 81 | Confirmation commande, stock disponible |
| Erreur | `#C0392B` | 192, 57, 43 | Formulaire invalide, rupture bloquante |
| Avertissement | `#D69B2C` | 214, 155, 44 | Stock faible, livraison retardée |

**Pourquoi :** un vert et un jaune désaturés vers des tons "terreux" pour rester dans l'univers naturel de la marque plutôt que des couleurs système trop vives et digitales.

---

## 2. Typographie & hiérarchie textuelle

### Police de titres — **Fraunces**
Serif contemporaine, légèrement rustique, avec du caractère (contraste marqué, empattements doux). Elle évoque l'artisanat et le premium sans tomber dans le "luxe froid" (type Playfair). Idéale pour un positionnement moyen-haut de gamme qui doit rester chaleureux et accessible aux familles.
- Poids recommandés : *SemiBold (600)* pour H1/H2, *Medium (500)* pour H3.

### Police de corps — **Inter**
Sans-serif très lisible à toutes tailles d'écran, excellent rendu sur mobile, large support des accents français. Neutre pour laisser Fraunces porter la personnalité de marque, tout en garantissant une lisibilité irréprochable pour les descriptions techniques (essences de bois, taux d'humidité, puissance des fourneaux...).

### Échelle typographique
| Élément | Police | Taille (desktop) | Taille (mobile) | Poids |
|---|---|---|---|---|
| H1 (titre de page) | Fraunces | 40px | 28px | 600 |
| H2 (titre de section) | Fraunces | 28px | 22px | 600 |
| H3 (titre carte/module) | Fraunces | 20px | 18px | 500 |
| Corps de texte | Inter | 16px | 15px | 400 |
| Légendes / mentions | Inter | 13px | 12px | 400 |
| **Prix** | Inter | 22px (barré promo: 16px) | 18px | 700 |

**Pourquoi le prix en Inter Bold et non en Fraunces :** le prix doit être scanné en une fraction de seconde — une sans-serif grasse est plus rapide à lire qu'une serif stylisée à ce niveau de hiérarchie.

---

## 3. Éléments d'interface (UI)

### Boutons
| Type | Fond | Texte | Radius | Détails |
|---|---|---|---|---|
| CTA principal | `#B23A2E` | Blanc | 8px | Ombre légère `0 4px 12px rgba(178,58,46,0.25)`, padding généreux (16px/32px) |
| CTA hover | `#8F2E24` | Blanc | 8px | Léger scale 1.02 + transition 150ms |
| CTA actif (clic) | `#7A2620` | Blanc | 8px | Sans ombre (effet "pressé") |
| Secondaire | Transparent, bordure `#6B4226` 1.5px | `#6B4226` | 8px | Hover : fond `#F5EEE3` |
| Désactivé | `#E2DCD1` | `#A79C8E` | 8px | Curseur "not-allowed", pas d'ombre |

**Radius 8px** (ni carré, ni pilule) : assez arrondi pour rester chaleureux/organique (cohérent avec les courbes du logo), assez droit pour garder le sérieux nécessaire à un achat "investissement" (fourneau, palettes de bois).

### Cartes produits
- Fond blanc pur, bordure `1px solid #E2DCD1`
- `border-radius: 12px`
- Ombre au repos : `0 2px 8px rgba(43,36,32,0.06)`
- Ombre au survol : `0 8px 24px rgba(43,36,32,0.12)` + léger `translateY(-4px)`
- Image produit en haut (ratio 1:1 ou 4:5), padding interne 16-20px
- Prix toujours en bas à gauche, bouton "Ajouter" en bas à droite ou pleine largeur sous le prix

### Badges & tags
| Badge | Fond | Texte | Style |
|---|---|---|---|
| **Nouveau** | `#6B4226` | Blanc | Rectangle radius 4px, majuscules, letter-spacing |
| **En solde / -X%** | `#B23A2E` | Blanc | Radius 4px, coin supérieur gauche de l'image |
| **Rupture de stock** | `#F0EDE7` | `#7A7167` | Contour discret, texte barré possible, image en 60% d'opacité |
| **Stock faible** | `#D69B2C` (fond clair `#FBF0DA`) | `#8A6115` | Petit point + texte ("Plus que 3 en stock") |

**Pourquoi séparer visuellement "Nouveau" (brun) et "Solde" (rouge) :** éviter que tout paraisse être une promotion en continu, ce qui dégraderait la perception de qualité/premium — un des risques principaux du secteur "bois de chauffage" où beaucoup d'acteurs bradent leurs prix.

---

## 4. Style d'imagerie & iconographie

### Direction artistique photo
- **Packshots produits (bûches, palettes, sacs) :** fond blanc/gris très clair (`#F5F3EF`), éclairage studio doux, ombre portée légère au sol — pour la comparabilité et la clarté du catalogue.
- **Fourneaux/poêles :** photos lifestyle en situation réelle (salon, chalet, famille), lumière chaude et naturelle (golden hour ou feu allumé), toujours avec un cadre de vie "cocooning familial" plutôt qu'un rendu 3D froid — renforce l'aspirationnel sans perdre le côté accessible.
- **Photos d'ambiance homepage :** bois empilé, feu dans l'âtre, mains d'un parent/enfant près du poêle — humaniser un produit fonctionnel.
- Éviter : stock photos génériques trop lisses, filtres froids/bleutés (casse l'univers "chaleur").

### Style d'icônes
**Outline (contour), traits de 1.5-2px, coins légèrement arrondis** — cohérent avec le radius 8-12px des boutons/cartes. Pas d'icônes "filled" en usage courant (trop lourd visuellement à côté de la typo serif), sauf pour les icônes d'état critiques (panier plein, alerte stock) où le "filled" attire l'œil quand c'est nécessaire.

---

## 5. Principes UX / Conversion (fiche produit & checkout)

1. **Un seul CTA rouge visible à l'écran à la fois.** Sur la fiche produit comme au checkout, le rouge `#B23A2E` est réservé exclusivement au bouton d'action principal ("Ajouter au panier", "Commander"). Aucune autre couleur ne doit rivaliser en saturation — les liens secondaires (retour, comparer) restent en brun ou gris neutre. C'est la règle CRO la plus simple et la plus efficace : la hiérarchie visuelle doit désigner sans ambiguïté la prochaine action.

2. **Réassurance visible immédiatement sous le CTA.** Pour un achat "lourd" et réfléchi (bois en palette, fourneau), placer juste sous le bouton d'achat 2-3 icônes outline + texte court : livraison/délai, garantie, essence certifiée/origine du bois. Cela répond à l'objection principale du foyer ("est-ce fiable, est-ce que ça va arriver en bon état") au moment exact où le doute freine la conversion.

3. **Checkout minimaliste et progressif, sans distraction chromatique.** Retirer toute couleur non essentielle de l'écran de paiement (pas de bannière promo, pas de badges colorés) : seuls le brun (structure), le neutre (fond) et le rouge CTA (bouton de validation) doivent apparaître. Une barre de progression simple (1. Livraison → 2. Paiement → 3. Confirmation) en brun/beige rassure sur la longueur du parcours et réduit l'abandon de panier, particulièrement important sur des commandes au panier moyen élevé (produit type fourneau).

---

*Charte établie à partir de l'univers visuel du logo SwissWood (bois, montagne, braise) pour garantir une cohérence totale entre identité de marque et expérience e-commerce.*
