# Charte Graphique — SwissWood
### Bois de construction | Positionnement moyen-haut de gamme | Cible B2B professionnelle

---

## Note de cadrage stratégique

Le logo existant pose déjà les fondations : bois brun texturé (qualité, matière noble), sommets enneigés (origine suisse, fiabilité, altitude = exigence), et une touche de rouge dynamique (énergie, action). Cette charte prolonge cet univers vers l'interface e-commerce en gardant un objectif : **rassurer un acheteur professionnel** (artisan, entreprise du BTP, architecte) tout en facilitant la conversion — devis rapide, réassort, commande en volume.

---

## 1. Palette de couleurs

### Couleur primaire — Noyer profond
| | |
|---|---|
| **Hex** | `#3E2A1F` |
| **RGB** | 62, 42, 31 |
| **Rôle** | Logo, header, footer, titres forts, éléments de navigation |

**Pourquoi :** reprend le brun foncé du logo. Un brun profond (plutôt que noir) évoque le bois massif, la matière brute travaillée — plus chaleureux et « matériau vrai » qu'un charbon générique de tech B2B. Rassure sur le sérieux sans être froid.

### Couleur secondaire — Bois clair / Chêne
| | |
|---|---|
| **Hex** | `#C9A876` |
| **RGB** | 201, 168, 118 |
| **Rôle** | Accents, séparateurs, fonds de sections, icônes secondaires, hover discret |

**Pourquoi :** le ton clair du bois du logo. Sert de respiration entre le brun dense et les zones blanches, et rappelle la texture bois sans en abuser (évite l'effet « site catalogue bois massif » daté).

### Couleur d'action (CTA) — Rouge Alpin
| | |
|---|---|
| **Hex** | `#B23A2E` |
| **RGB** | 178, 58, 46 |
| **Rôle** | Boutons « Ajouter au panier », « Demander un devis », liens critiques, prix promo |

**Pourquoi :** dérivé du rouge du logo, légèrement désaturé pour rester premium (évite le rouge criard type promo agressive). C'est la SEULE couleur chaude saturée du site : sa rareté garantit qu'elle attire l'œil immédiatement sur les CTA — principe clé de CRO (contraste = hiérarchie).

### Fonds & Neutres
| Usage | Hex | RGB |
|---|---|---|
| Fond général | `#F7F5F1` | 247, 245, 241 |
| Fond cartes produits | `#FFFFFF` | 255, 255, 255 |
| Bordures / séparateurs | `#E4DFD6` | 228, 223, 214 |
| Texte principal | `#241A13` | 36, 26, 19 |
| Texte secondaire / gris | `#6E6259` | 110, 98, 89 |

**Pourquoi :** un blanc cassé chaud (pas un blanc pur clinique) prolonge l'univers bois tout en gardant la clarté nécessaire à un site e-commerce technique (fiches produits denses en specs).

### Couleurs d'état
| État | Hex | RGB | Usage |
|---|---|---|---|
| Succès | `#2E7D4F` | 46, 125, 79 | Stock disponible, commande confirmée |
| Erreur | `#C1352A` | 193, 53, 42 | Rupture, erreur formulaire |
| Avertissement | `#D98A1E` | 217, 138, 30 | Stock faible, délai allongé |

*Ces trois teintes sont volontairement distinctes du rouge CTA (plus orangé/rouille) pour qu'un utilisateur ne confonde jamais un message d'erreur avec un bouton d'achat.*

---

## 2. Typographie & hiérarchie

### Police de titres — **Fraunces**
Serif contemporain, chaleureux, à empattements marqués et légère irrégularité « faite main ». Disponible sur Google Fonts, très modulable (variable font : de « soft » à « sharp »).

**Pourquoi :** un serif expressif évite le piège du site B2B « corporate froid » (trop de sans-serif géométrique dans l'industrie du bâtiment). Fraunces évoque l'artisanat et le savoir-faire tout en restant lisible en grand format — cohérent avec un positionnement moyen-haut de gamme.

### Police de corps — **Inter**
Sans-serif ultra-lisible, optimisée pour les écrans, excellente à petite taille (fiches techniques, tableaux de dimensions, prix).

**Pourquoi :** Inter est conçue pour la densité d'information (chiffres tabulaires alignés — essentiel pour comparer des prix/formats de bois). Elle contraste avec Fraunces sans le concurrencer : le duo serif expressif / sans-serif fonctionnel est un classique du positionnement premium fiable.

### Échelle typographique
| Élément | Police | Taille (desktop) | Poids |
|---|---|---|---|
| H1 (page produit / titre section) | Fraunces | 40–48px | 600 |
| H2 (sous-titres) | Fraunces | 28–32px | 500 |
| H3 (nom produit, cartes) | Fraunces | 20–22px | 500 |
| Corps de texte | Inter | 16px | 400 |
| Légendes / specs techniques | Inter | 13–14px | 400 |
| Prix | Inter (chiffres tabulaires) | 22–26px | 700 |
| Prix barré (avant promo) | Inter | 16px | 400, texte gris + barré |

---

## 3. Éléments d'interface (UI)

### Boutons
- **CTA principal** : fond `#B23A2E`, texte blanc, `border-radius: 6px`, padding généreux (14px/28px), pas d'ombre agressive — ombre douce `0 2px 8px rgba(62,42,31,0.15)`.
  - *Hover* : assombrissement léger `#9A2F25` + micro-élévation (translateY -1px).
  - *Actif* : retour à plat, léger enfoncement visuel.
  - *Désactivé* : fond `#E4DFD6`, texte `#A69C8F`, curseur not-allowed.
- **Bouton secondaire** : fond transparent, bordure `1.5px solid #3E2A1F`, texte `#3E2A1F`. *Hover* : fond `#3E2A1F` à 6% d'opacité.
- **Bouton tertiaire / lien texte** : couleur primaire, soulignement au survol uniquement (évite la surcharge visuelle sur des pages avec beaucoup de liens de navigation type "voir la fiche technique").

**Pourquoi des angles peu arrondis (6px) :** un radius trop généreux (16–20px, type app mobile ludique) désaligne avec la solidité attendue d'un matériau de construction. 6–8px = moderne mais sérieux.

### Cartes produits
- Fond blanc pur `#FFFFFF` sur fond de page beige, pour que le produit « ressorte ».
- `border-radius: 8px`
- Bordure fine `1px solid #E4DFD6` (pas d'ombre par défaut — ombre uniquement au survol : `0 8px 24px rgba(62,42,31,0.10)` + léger translateY, pour signaler l'interactivité sans surcharge visuelle sur des grilles de 20+ produits).
- Zone image avec fond neutre légèrement plus clair que la carte (`#FAF8F5`) pour uniformiser les packshots.
- Bloc info compact : nom (H3 Fraunces), essence/dimensions (Inter, gris), prix (Inter bold), badge stock.

### Badges & tags
| Badge | Fond | Texte | Style |
|---|---|---|---|
| En solde | `#B23A2E` | Blanc | Angle carré ou 4px, coin haut-gauche de l'image |
| Nouveau | `#3E2A1F` | Blanc/Beige clair | Pastille discrète |
| Rupture de stock | `#F7F5F1` (fond clair) | `#C1352A` | Contour fin, overlay léger sur l'image en grisé (opacity 0.6) |
| Stock faible | transparent | `#D98A1E` | Petit point + texte, pas de fond plein (évite l'agressivité visuelle) |

---

## 4. Imagerie & iconographie

### Direction artistique photo
- **Packshots produits** : fond blanc/gris très clair studio, éclairage neutre et homogène, angle 3/4 pour montrer la texture et la coupe du bois — la texture du grain doit être nette et zoomable (critère d'achat n°1 pour du bois : voir le veinage, les nœuds, la teinte réelle).
- **Photos d'usage/contexte** : registre « lifestyle chantier » sobre — bois en situation réelle (charpente, structure, empilement en entrepôt), lumière naturelle, pas de mise en scène trop « décoration d'intérieur ». Cela parle directement à la cible professionnelle (chantier, pas Pinterest).
- **Cohérence colorimétrique** : légère chaleur dans l'étalonnage (tons bruns/beiges rehaussés) pour unifier toutes les photos avec la palette de marque, même si prises par différents fournisseurs.

### Style d'icônes
- **Outline (trait fin, 1.5–2px)**, angles légèrement arrondis, monochrome `#3E2A1F` par défaut, passant au rouge CTA au survol si icône interactive.
- Éviter le style « filled » plein qui alourdit visuellement une grille dense de specs techniques (icônes de dimensions, poids, certification, essence).
- Un set cohérent (type Phosphor Icons ou Lucide) pour garantir l'harmonie sur l'ensemble des pictogrammes techniques (norme CE, origine, traitement du bois, etc.).

---

## 5. Principes UX / Conversion (CRO)

**1. Un seul rouge, une seule signification.**
Le rouge `#B23A2E` est réservé exclusivement à l'action d'achat/devis. Aucun autre élément du site (icônes, liens, décor) ne doit utiliser cette teinte. Sur une fiche produit dense en informations techniques, l'œil doit identifier le CTA en moins d'une seconde — la rareté chromatique fait tout le travail.

**2. Les données techniques priment sur le marketing visuel.**
Pour une cible pro, le tableau de spécifications (essence, classe d'emploi, dimensions, certification, délai de disponibilité) doit être visible **au-dessus de la ligne de flottaison**, au même niveau que le prix — pas relégué en bas de page. Un acheteur B2B décide sur la donnée technique avant l'esthétique.

**3. Réduire la friction du checkout pour les commandes en volume.**
Prévoir dès la fiche produit un sélecteur de quantité par unité métier (m³, ml, palette) plutôt qu'un simple compteur +/-, avec calcul de prix dégressif visible instantanément. Ajouter un CTA secondaire « Demander un devis groupé » à côté du CTA panier classique — beaucoup d'achats pro passent par la négociation, pas l'achat direct impulsif.
