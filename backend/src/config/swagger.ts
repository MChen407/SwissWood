import { env } from './env.js'

export const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'SwissWood API',
    version: '1.0.0',
    description:
      "API REST du site e-commerce SwissWood (Express, TypeScript, Prisma, MySQL).\n\n" +
      "Tous les endpoints protégés attendent un JWT d'accès via l'en-tête `Authorization: Bearer <token>`.\n" +
      'L‘enveloppe de réponse est toujours `{ success, data }` ou `{ success, error }`.',
    contact: { email: 'contact@swisswood.ch' },
  },
  servers: [
    {
      url: `http://localhost:${env.PORT}${env.API_PREFIX}`,
      description: 'Serveur de développement',
    },
  ],
  tags: [
    { name: 'Health', description: 'État de l’API' },
    { name: 'Auth', description: 'Authentification (email/mot de passe, JWT, OAuth Google)' },
    { name: 'Products', description: 'Catalogue produits' },
    { name: 'Orders', description: 'Commandes clients' },
    { name: 'Favorites', description: 'Favoris / wishlist' },
    { name: 'Reviews', description: 'Avis produits' },
    { name: 'Contact', description: 'Messages de contact' },
    { name: 'CMS', description: 'Contenus CMS' },
    { name: 'Admin', description: 'Administration (rôle admin / super_admin requis)' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      ApiError: {
        type: 'object',
        properties: {
          success: { type: 'boolean', enum: [false] },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'NOT_FOUND' },
              message: { type: 'string' },
              details: { oneOf: [{ type: 'object' }, { type: 'array' }, { type: 'string' }] },
            },
            required: ['code', 'message'],
          },
        },
        required: ['success', 'error'],
      },
      ApiSuccess: {
        type: 'object',
        properties: {
          success: { type: 'boolean', enum: [true] },
          data: {},
        },
        required: ['success', 'data'],
      },
      UserPublic: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email' },
          first_name: { type: 'string' },
          last_name: { type: 'string' },
          phone: { type: 'string', nullable: true },
          address: { type: 'string', nullable: true },
          city: { type: 'string', nullable: true },
          country: { type: 'string' },
          role: { type: 'string', enum: ['customer', 'admin', 'super_admin'] },
          avatar_url: { type: 'string', nullable: true },
          email_verified: { type: 'boolean' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      AuthSession: {
        type: 'object',
        properties: {
          user: { $ref: '#/components/schemas/UserPublic' },
          tokens: {
            type: 'object',
            properties: {
              accessToken: { type: 'string' },
              refreshToken: { type: 'string' },
              expiresIn: { type: 'string', example: '15m' },
            },
            required: ['accessToken', 'refreshToken', 'expiresIn'],
          },
        },
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          slug: { type: 'string' },
          essence: { type: 'string', enum: ['Teck', 'Iroko', 'Pin', 'Sapin'] },
          description: { type: 'string' },
          price_eur: { type: 'number', description: 'En centimes' },
          price_usd: { type: 'number', description: 'En centimes' },
          price_fcfa: { type: 'number' },
          stock: { type: 'number' },
          dimensions: { type: 'object' },
          images: { type: 'array', items: { type: 'string' } },
          characteristics: { type: 'object' },
          is_active: { type: 'boolean' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      PaginatedProducts: {
        type: 'object',
        properties: {
          items: { type: 'array', items: { $ref: '#/components/schemas/Product' } },
          total: { type: 'integer' },
          limit: { type: 'integer' },
          offset: { type: 'integer' },
        },
      },
      ProductReview: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          product_id: { type: 'string', format: 'uuid' },
          user_id: { type: 'string', format: 'uuid' },
          rating: { type: 'integer', minimum: 1, maximum: 5 },
          comment: { type: 'string' },
          is_approved: { type: 'boolean' },
          is_rejected: { type: 'boolean' },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      OrderItem: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          order_id: { type: 'string', format: 'uuid' },
          product_id: { type: 'string', format: 'uuid' },
          quantity: { type: 'number' },
          unit: { type: 'string' },
          unit_price_eur: { type: 'number' },
          customization: { type: 'object' },
          created_at: { type: 'string', format: 'date-time' },
          product: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' },
              slug: { type: 'string' },
              images: { type: 'array', items: { type: 'string' } },
            },
          },
        },
      },
      Order: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          order_number: { type: 'string' },
          user_id: { type: 'string', format: 'uuid' },
          status: {
            type: 'string',
            enum: ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'],
          },
          payment_method: { type: 'string', enum: ['card', 'bank_transfer'] },
          payment_status: {
            type: 'string',
            enum: ['pending', 'awaiting_transfer', 'paid', 'failed', 'refunded'],
          },
          subtotal_eur: { type: 'number' },
          total_eur: { type: 'number' },
          currency: { type: 'string', enum: ['EUR', 'USD', 'FCFA'] },
          shipping_address: { type: 'object' },
          notes: { type: 'string', nullable: true },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      OrderDetail: {
        allOf: [
          { $ref: '#/components/schemas/Order' },
          {
            type: 'object',
            properties: {
              items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
              payments: { type: 'array', items: { $ref: '#/components/schemas/Payment' } },
            },
          },
        ],
      },
      Payment: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          order_id: { type: 'string', format: 'uuid' },
          user_id: { type: 'string', format: 'uuid' },
          method: { type: 'string', enum: ['card', 'bank_transfer'] },
          status: {
            type: 'string',
            enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
          },
          amount_eur: { type: 'number' },
          reference: { type: 'string' },
          metadata: { type: 'object' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      Favorite: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          user_id: { type: 'string', format: 'uuid' },
          product_id: { type: 'string', format: 'uuid' },
          created_at: { type: 'string', format: 'date-time' },
          product: { $ref: '#/components/schemas/Product' },
        },
      },
      CmsContent: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          key: { type: 'string' },
          value: { type: 'string' },
          type: { type: 'string' },
          label: { type: 'string' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      ContactReceipt: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          status: { type: 'string' },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      Stats: {
        type: 'object',
        properties: {
          revenue: { type: 'number' },
          orders: { type: 'integer' },
          customers: { type: 'integer' },
          products: { type: 'integer' },
          recent_orders: { type: 'array', items: { $ref: '#/components/schemas/Order' } },
        },
      },
      AdminPayment: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          order_id: { type: 'string', format: 'uuid' },
          method: { type: 'string', enum: ['card', 'bank_transfer'] },
          status: { type: 'string' },
          amount_eur: { type: 'number' },
          reference: { type: 'string' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
          order_number: { type: 'string' },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'État de l’API',
        operationId: 'health',
        security: [],
        responses: {
          '200': {
            description: 'API opérationnelle',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        status: { type: 'string', example: 'ok' },
                        message: { type: 'string' },
                        timestamp: { type: 'string', format: 'date-time' },
                        uptime: { type: 'number' },
                        environment: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    // ============================= AUTH =============================
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Créer un compte client',
        operationId: 'register',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 8 },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                },
                required: ['email', 'password', 'firstName', 'lastName'],
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Compte créé — retourne la session (utilisateur + tokens)',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/AuthSession' } },
            },
          },
          '409': {
            description: 'Un compte existe déjà avec cet email',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
          '422': {
            description: 'Données invalides',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
          '429': {
            description: 'Trop de requêtes, réessayez plus tard',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Se connecter',
        operationId: 'login',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
                required: ['email', 'password'],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Connexion réussie — session (utilisateur + tokens)',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/AuthSession' } },
            },
          },
          '401': {
            description: 'Identifiants incorrects',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
          '429': {
            description: 'Trop de tentatives, réessayez plus tard',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
        },
      },
    },
    '/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Rafraîchir la session (rotation du refresh token)',
        operationId: 'refresh',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { refreshToken: { type: 'string' } },
                required: ['refreshToken'],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Nouvelle session',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/AuthSession' } },
            },
          },
          '401': {
            description: 'Refresh token invalide ou expiré',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Révoquer le refresh token courant',
        operationId: 'logout',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: false,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { refreshToken: { type: 'string' } },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Session révoquée',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiSuccess' } } },
          },
        },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Profil de l’utilisateur courant',
        operationId: 'getMe',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Informations du profil',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/UserPublic' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Authentification requise',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
        },
      },
      patch: {
        tags: ['Auth'],
        summary: 'Mettre à jour son profil',
        operationId: 'updateMe',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  first_name: { type: 'string' },
                  last_name: { type: 'string' },
                  phone: { type: 'string', nullable: true },
                  address: { type: 'string', nullable: true },
                  city: { type: 'string', nullable: true },
                  country: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Profil mis à jour',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/UserPublic' },
                  },
                },
              },
            },
          },
          '422': {
            description: 'Données invalides',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
        },
      },
    },
    '/auth/me/change-password': {
      post: {
        tags: ['Auth'],
        summary: 'Changer son mot de passe',
        operationId: 'changePassword',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  currentPassword: { type: 'string' },
                  newPassword: { type: 'string', minLength: 8 },
                },
                required: ['currentPassword', 'newPassword'],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Mot de passe changé — toutes les sessions sont révoquées',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiSuccess' } } },
          },
          '400': {
            description: 'Mot de passe actuel incorrect',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
        },
      },
    },
    '/auth/google': {
      get: {
        tags: ['Auth'],
        summary: 'Redirection vers le flux OAuth Google',
        operationId: 'googleRedirect',
        security: [],
        responses: { '302': { description: 'Redirection vers Google' } },
      },
    },
    '/auth/google/callback': {
      get: {
        tags: ['Auth'],
        summary: 'Callback OAuth Google',
        operationId: 'googleCallback',
        security: [],
        parameters: [
          { name: 'code', in: 'query', required: true, schema: { type: 'string' } },
          { name: 'state', in: 'query', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '302': { description: 'Redirection vers le frontend avec access_token et refresh_token' },
        },
      },
    },
    '/auth/google/status': {
      get: {
        tags: ['Auth'],
        summary: 'État de la configuration OAuth Google',
        operationId: 'googleStatus',
        security: [],
        responses: {
          '200': {
            description: 'Configuré — contient l’URL d’autorisation',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiSuccess' } } },
          },
          '400': {
            description: 'OAuth Google non configuré',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
        },
      },
    },

    // ============================= PRODUCTS =============================
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'Lister les produits actifs (filtres, tri)',
        operationId: 'listProducts',
        security: [],
        parameters: [
          { name: 'essence', in: 'query', schema: { type: 'string', enum: ['Teck', 'Iroko', 'Pin', 'Sapin'] } },
          { name: 'exclude', in: 'query', schema: { type: 'string', format: 'uuid' }, description: 'Exclure cet ID (produits similaires)' },
          { name: 'sort', in: 'query', schema: { type: 'string', enum: ['price_asc', 'price_desc'] } },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 } },
          { name: 'offset', in: 'query', schema: { type: 'integer', minimum: 0, default: 0 } },
        ],
        responses: {
          '200': {
            description: 'Produits + pagination',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/PaginatedProducts' },
                  },
                },
              },
            },
          },
          '422': {
            description: 'Paramètres invalides',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
        },
      },
    },
    '/products/featured': {
      get: {
        tags: ['Products'],
        summary: 'Produits mis en avant (page d’accueil)',
        operationId: 'featuredProducts',
        security: [],
        parameters: [
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 6 } },
        ],
        responses: {
          '200': {
            description: 'Liste de produits',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Product' } },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/products/{slug}': {
      get: {
        tags: ['Products'],
        summary: 'Détail d’un produit par slug',
        operationId: 'getProductBySlug',
        security: [],
        parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': {
            description: 'Produit',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Product' },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Produit introuvable',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
        },
      },
    },
    '/products/{id}/reviews': {
      get: {
        tags: ['Products'],
        summary: 'Avis approuvés d’un produit',
        operationId: 'getProductReviews',
        security: [],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          '200': {
            description: 'Liste des avis approuvés',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/ProductReview' } },
                  },
                },
              },
            },
          },
          '404': { description: 'Produit introuvable' },
        },
      },
    },

    // ============================= ORDERS =============================
    '/orders': {
      post: {
        tags: ['Orders'],
        summary: 'Créer une commande (et ses articles)',
        operationId: 'createOrder',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        productId: { type: 'string', format: 'uuid' },
                        quantity: { type: 'integer', minimum: 1 },
                        unit: { type: 'string', default: 'pcs' },
                        customization: { type: 'object' },
                      },
                      required: ['productId', 'quantity'],
                    },
                  },
                  currency: { type: 'string', enum: ['EUR', 'USD', 'FCFA'], default: 'EUR' },
                  shipping_address: {
                    type: 'object',
                    properties: {
                      address: { type: 'string' },
                      city: { type: 'string' },
                      country: { type: 'string' },
                      phone: { type: 'string' },
                      notes: { type: 'string' },
                    },
                  },
                  notes: { type: 'string' },
                },
                required: ['items'],
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Commande créée',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Order' },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Produit introuvable',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
          '422': {
            description: 'Données invalides',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
        },
      },
      get: {
        tags: ['Orders'],
        summary: 'Mes commandes',
        operationId: 'listMyOrders',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Liste des commandes de l’utilisateur',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Order' } },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/orders/{id}': {
      get: {
        tags: ['Orders'],
        summary: 'Détail d’une commande (articles + paiements)',
        operationId: 'getMyOrder',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          '200': {
            description: 'Détail de la commande',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/OrderDetail' },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Commande introuvable ou non possédée',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
        },
      },
    },
    '/orders/{id}/payment': {
      post: {
        tags: ['Orders'],
        summary: 'Initialiser un paiement (carte ou virement)',
        operationId: 'initPayment',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  method: { type: 'string', enum: ['card', 'bank_transfer'] },
                },
                required: ['method'],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Paiement initialisé',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiSuccess' } } },
          },
          '400': {
            description: 'Commande déjà payée ou paiement en attente',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
          '404': {
            description: 'Commande introuvable',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
        },
      },
    },
    '/orders/{id}/payment/confirm': {
      post: {
        tags: ['Orders'],
        summary: 'Confirmer le paiement (fin de flux simulation)',
        operationId: 'confirmPayment',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          '200': {
            description: 'Paiement confirmé, commande passée à “paid / confirmed”',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Order' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Aucun paiement initialisé ou commande déjà confirmée',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
        },
      },
    },

    // ============================= FAVORITES =============================
    '/favorites': {
      get: {
        tags: ['Favorites'],
        summary: 'Mes favoris (produits embarqués)',
        operationId: 'listFavorites',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Liste des favoris',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Favorite' } },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/favorites/{productId}': {
      post: {
        tags: ['Favorites'],
        summary: 'Ajouter un favori',
        operationId: 'addFavorite',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'productId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          '201': {
            description: 'Favori ajouté',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Favorite' },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Produit introuvable',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
        },
      },
      delete: {
        tags: ['Favorites'],
        summary: 'Retirer un favori',
        operationId: 'removeFavorite',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'productId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          '200': {
            description: 'Favori retiré',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiSuccess' } } },
          },
        },
      },
    },

    // ============================= REVIEWS =============================
    '/reviews': {
      post: {
        tags: ['Reviews'],
        summary: 'Publier un avis (en attente de modération)',
        operationId: 'createReview',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  productId: { type: 'string', format: 'uuid' },
                  rating: { type: 'integer', minimum: 1, maximum: 5 },
                  comment: { type: 'string' },
                },
                required: ['productId', 'rating'],
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Avis créé',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/ProductReview' },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Produit introuvable ou inactif',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
        },
      },
    },
    '/reviews/mine': {
      get: {
        tags: ['Reviews'],
        summary: 'Mes avis',
        operationId: 'listMyReviews',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Liste de mes avis',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/ProductReview' } },
                  },
                },
              },
            },
          },
        },
      },
    },

    // ============================= CONTACT =============================
    '/contact': {
      post: {
        tags: ['Contact'],
        summary: 'Envoyer un message de contact',
        operationId: 'sendContact',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  subject: { type: 'string' },
                  message: { type: 'string' },
                },
                required: ['name', 'email', 'subject', 'message'],
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Message enregistré',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/ContactReceipt' },
                  },
                },
              },
            },
          },
          '422': {
            description: 'Données invalides',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
          '429': {
            description: 'Trop de messages, réessayez plus tard',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
        },
      },
    },

    // ============================= CMS =============================
    '/cms': {
      get: {
        tags: ['CMS'],
        summary: 'Contenus CMS publics (key → value)',
        operationId: 'getCms',
        security: [],
        responses: {
          '200': {
            description: 'Contenus',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/CmsContent' } },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/admin/cms': {
      get: {
        tags: ['Admin'],
        summary: 'Lister le contenu CMS (version admin, toutes les clés)',
        operationId: 'adminListCms',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Contenus',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/CmsContent' } },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/admin/cms/{id}': {
      patch: {
        tags: ['Admin'],
        summary: 'Mettre à jour un contenu CMS',
        operationId: 'adminUpdateCms',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  value: { type: 'string' },
                  label: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Contenu mis à jour',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/CmsContent' },
                  },
                },
              },
            },
          },
          '400': { description: 'Aucune modification fournie' },
          '404': { description: 'Contenu introuvable' },
        },
      },
    },

    // ============================= ADMIN =============================
    '/admin/stats': {
      get: {
        tags: ['Admin'],
        summary: 'Statistiques du tableau de bord',
        operationId: 'adminStats',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Statistiques',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Stats' },
                  },
                },
              },
            },
          },
          '401': { description: 'Authentification requise' },
          '403': {
            description: 'Rôle insuffisant (admin requis)',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
        },
      },
    },
    '/admin/payments': {
      get: {
        tags: ['Admin'],
        summary: 'Lister tous les paiements',
        operationId: 'adminListPayments',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Paiements',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/AdminPayment' } },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/admin/clients': {
      get: {
        tags: ['Admin'],
        summary: 'Lister les clients',
        operationId: 'adminListClients',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Clients',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/UserPublic' } },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/admin/clients/{id}/role': {
      patch: {
        tags: ['Admin'],
        summary: 'Changer le rôle d’un utilisateur',
        operationId: 'adminUpdateClientRole',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  role: { type: 'string', enum: ['customer', 'admin', 'super_admin'] },
                },
                required: ['role'],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Rôle mis à jour',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/UserPublic' },
                  },
                },
              },
            },
          },
          '404': { description: 'Utilisateur introuvable' },
        },
      },
    },
    '/admin/products': {
      get: {
        tags: ['Admin'],
        summary: 'Lister tous les produits (y compris inactifs)',
        operationId: 'adminListProducts',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Produits',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Product' } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Admin'],
        summary: 'Créer un produit',
        operationId: 'adminCreateProduct',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  slug: { type: 'string' },
                  essence: { type: 'string', enum: ['Teck', 'Iroko', 'Pin', 'Sapin'] },
                  description: { type: 'string' },
                  price_eur: { type: 'integer', minimum: 0 },
                  price_usd: { type: 'integer', minimum: 0 },
                  price_fcfa: { type: 'integer', minimum: 0 },
                  stock: { type: 'integer', minimum: 0 },
                  dimensions: { type: 'object' },
                  images: { type: 'array', items: { type: 'string' } },
                  characteristics: { type: 'object' },
                  is_active: { type: 'boolean', default: true },
                },
                required: ['name', 'essence', 'price_eur', 'price_usd', 'price_fcfa', 'stock'],
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Produit créé',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Product' },
                  },
                },
              },
            },
          },
          '409': { description: 'Slug déjà utilisé' },
        },
      },
    },
    '/admin/products/{id}': {
      patch: {
        tags: ['Admin'],
        summary: 'Mettre à jour un produit',
        operationId: 'adminUpdateProduct',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  slug: { type: 'string' },
                  essence: { type: 'string', enum: ['Teck', 'Iroko', 'Pin', 'Sapin'] },
                  description: { type: 'string' },
                  price_eur: { type: 'integer', minimum: 0 },
                  price_usd: { type: 'integer', minimum: 0 },
                  price_fcfa: { type: 'integer', minimum: 0 },
                  stock: { type: 'integer', minimum: 0 },
                  dimensions: { type: 'object' },
                  images: { type: 'array', items: { type: 'string' } },
                  characteristics: { type: 'object' },
                  is_active: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Produit mis à jour',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Product' },
                  },
                },
              },
            },
          },
          '409': { description: 'Slug déjà utilisé par un autre produit' },
          '404': { description: 'Produit introuvable' },
        },
      },
      delete: {
        tags: ['Admin'],
        summary: 'Supprimer un produit',
        operationId: 'adminDeleteProduct',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          '200': {
            description: 'Produit supprimé',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiSuccess' } } },
          },
          '404': { description: 'Produit introuvable' },
        },
      },
    },
    '/admin/orders': {
      get: {
        tags: ['Admin'],
        summary: 'Lister toutes les commandes',
        operationId: 'adminListOrders',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Commandes',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Order' } },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/admin/orders/{id}/status': {
      patch: {
        tags: ['Admin'],
        summary: 'Mettre à jour le statut d’une commande',
        operationId: 'adminUpdateOrderStatus',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string', enum: ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'] },
                },
                required: ['status'],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Statut mis à jour',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Order' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/admin/orders/{id}/payment': {
      patch: {
        tags: ['Admin'],
        summary: 'Mettre à jour le statut de paiement d’une commande',
        operationId: 'adminUpdateOrderPayment',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  payment_status: { type: 'string', enum: ['pending', 'awaiting_transfer', 'paid', 'failed', 'refunded'] },
                },
                required: ['payment_status'],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Statut de paiement mis à jour',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Order' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/admin/reviews': {
      get: {
        tags: ['Admin'],
        summary: 'Lister tous les avis (avec produit)',
        operationId: 'adminListReviews',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Avis',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/ProductReview' } },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/admin/reviews/{id}/approve': {
      patch: {
        tags: ['Admin'],
        summary: 'Approuver un avis',
        operationId: 'adminApproveReview',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          '200': {
            description: 'Avis approuvé',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/ProductReview' },
                  },
                },
              },
            },
          },
          '404': { description: 'Avis introuvable' },
        },
      },
    },
    '/admin/reviews/{id}/reject': {
      patch: {
        tags: ['Admin'],
        summary: 'Rejeter un avis',
        operationId: 'adminRejectReview',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          '200': {
            description: 'Avis rejeté',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/ProductReview' },
                  },
                },
              },
            },
          },
          '404': { description: 'Avis introuvable' },
        },
      },
    },

    '/admin/uploads/images': {
      post: {
        tags: ['Admin'],
        summary: 'Uploader des images produits (multipart)',
        operationId: 'adminUploadImages',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  images: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                    description: 'Images (JPEG, PNG, WEBP, GIF) — max 8 fichiers, 10 Mo chacun',
                  },
                },
                required: ['images'],
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'URLs des images uploadées',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        urls: { type: 'array', items: { type: 'string' } },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': { description: 'Aucun fichier / type non autorisé / trop volumineux' },
          '401': { description: 'Non authentifié' },
          '403': { description: 'Accès interdit pour ce rôle' },
        },
      },
    },
  },
}