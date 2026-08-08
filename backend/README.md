# SwissWood API — Backend

API REST du site e-commerce **SwissWood** (bois de construction premium).

- **Runtime :** Node.js ≥ 20
- **Framework :** Express.js
- **Langage :** TypeScript (strict)
- **Base de données :** MySQL (ORM Prisma)
- **Authentification :** JWT (access + refresh avec rotation) + OAuth Google
- **Documentation :** Swagger UI (`/api/docs`)

---

## 1. Prérequis

- Node.js ≥ 20 (testé sous Node 24)
- MySQL ≥ 8 (local ou distant)
- npm ≥ 9

## 2. Installation

```bash
cd backend
npm install
```

## 3. Configuration

Créez le fichier `.env` à partir du modèle :

```bash
cp .env.example .env
```

Renseignez les variables obligatoires :

| Variable               | Description                                   | Exemple                              |
| ---------------------- | --------------------------------------------- | ------------------------------------ |
| `DATABASE_URL`         | Connexion MySQL (Prisma)                      | `mysql://root:password@localhost:3306/swisswood` |
| `JWT_ACCESS_SECRET`    | Secret du token d'**accès** (≥ 16 caractères) | `...une longue chaîne aléatoire...`  |
| `JWT_REFRESH_SECRET`   | Secret du token de **refresh**                | `...une autre longue chaîne...`      |
| `LOGIN_RATE_LIMIT_MAX` | Tentatives de connexion autorisées            | `10`                                 |

⚠️ Ne commitez jamais le fichier `.env` (il est gitignoré).

## 4. Base de données (migrations + seed)

```bash
npx prisma migrate dev --name init   # crée & applique les migrations
npx prisma generate                  # génère le client Prisma
npm run prisma:seed                  # charge produits, CMS et super admin
```

Le seed crée le premier **super admin** (vars `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`, défauts : `admin@swisswood.ch` / `Admin123!`).

## 5. Lancement

```bash
npm run dev        # dev avec rechargement (tsx watch)
npm run build      # compilation TypeScript
npm start          # exécution de la version compilée (dist/)
```

L'API est servie sur :

- Base : `http://localhost:4000/api`
- Swagger : `http://localhost:4000/api/docs`
- Santé : `http://localhost:4000/api/health`

## 6. Scripts disponibles

| Script                    | Description                                |
| ------------------------- | ------------------------------------------ |
| `npm run dev`             | Serveur de développement (hot reload)      |
| `npm run build`           | Compilation TypeScript → `dist/`           |
| `npm start`               | Démarre la version compilée                |
| `npm run typecheck`       | Vérification TypeScript (strict, no-emit)  |
| `npm run lint`            | ESLint (règles strictes)                   |
| `npm run lint:fix`        | Corrections automatiques ESLint            |
| `npm run format`          | Formatage Prettier                         |
| `npm run test`            | Tests unitaires / intégration (vitest)     |
| `npm run prisma:migrate`  | `prisma migrate dev`                       |
| `npm run prisma:deploy`   | `prisma migrate deploy` (production)       |
| `npm run prisma:seed`     | Chargement des données de démo             |
| `npm run prisma:studio`   | Interface graphique Prisma Studio          |

## 7. Architecture

```
src/
├── config/          # env (zod), base de données, Swagger
├── controllers/     # couche HTTP légère (sans logique métier)
├── routes/          # définition des routes REST
├── services/        # logique métier (règles de gestion)
├── repositories/    # accès aux données (Prisma uniquement ici)
├── middlewares/     # auth (JWT), RBAC, rate-limit, validation, erreurs
├── validators/      # schémas Zod (body, params, query)
├── dto/             # transformation entités → format API (snake_case)
├── interfaces/      # types partagés de l'API
├── constants/       # énumérations & listes de référence
├── utils/           # ApiResponse, asyncHandler, exceptions HTTP
├── docs/            # documentation (complément Swagger)
└── …                # tests : dossier /tests (à la racine du backend)
```

Principes appliqués : **SOLID**, **DRY**, **séparation des responsabilités** — aucun accès DB dans un controller, toute la logique métier vit dans les services.

## 8. Convention de réponse

Succès :

```json
{ "success": true, "data": { } }
```

Erreur :

```json
{ "success": false, "error": { "code": "NOT_FOUND", "message": "...", "details": { } } }
```

## 9. Sécurité

- Hash `bcrypt` (12 rounds) pour les mots de passe
- JWT access (court) + refresh (rotation + réversion en base)
- Rate limiting ciblé : global (15 min), login, register, refresh, contact (strict)
- Helmet (CSP configuré pour Swagger UI), CORS restreints par origine
- Validation strict Zod côté serveur (body / params / query)
- Variables sensibles uniquement dans `.env`

## 10. Tests

```bash
npm test               # exécution des tests (vitest)
npm run test:watch     # mode watch
```

Les tests ciblent la logique métier (services) et la surface HTTP (contrôleurs / middleware) **sans base de données réelle** : les repositories sont mockés (`vi.mock`) et l'application Express est pilotée avec `supertest`.

```
tests/
├── setup.ts                    # variables d'environnement de test
├── unit/
│   ├── token.service.test.ts   # JWT, refresh, durées
│   ├── httpErrors.test.ts      # hiérarchie des erreurs HTTP
│   ├── validators.test.ts      # schémas Zod (auth, users, orders, admins…)
│   ├── order.service.test.ts   # création (stock, prix serveur), possession
│   ├── payment.service.test.ts # init/confirm (carte, virement)
│   ├── favorite.service.test.ts
│   ├── review.service.test.ts  # modération (approve / reject)
│   └── product.service.test.ts # liste, slug, slugify admin, conflits
└── integration/
    └── api.test.ts             # enveloppe API, validation, auth, RBAC
```

⚠️ Le `DATABASE_URL` de test n'est pas réellement contacté : les tests reposent uniquement sur des mocks.

## 11. Déploiement (résumé)

1. `npm run build`
2. Appliquer les migrations : `npm run prisma:deploy`
3. Vérifier les variables d'environnement de production
4. Lancer avec `npm start` (derrière un proxy, en HTTPS)