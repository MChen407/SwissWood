import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(_, __, saved) { return saved ?? { top: 0 } },
  routes: [
    { path: '/', name: 'home', component: () => import('@/pages/HomePage.vue') },
    { path: '/catalogue', name: 'catalogue', component: () => import('@/pages/CataloguePage.vue') },
    { path: '/produits/:slug', name: 'product', component: () => import('@/pages/ProductPage.vue') },
    { path: '/panier', name: 'cart', component: () => import('@/pages/CartPage.vue') },
    { path: '/commande', name: 'checkout', component: () => import('@/pages/CheckoutPage.vue'), meta: { requiresAuth: true } },
    { path: '/paiement', name: 'payment', component: () => import('@/pages/PaymentPage.vue'), meta: { requiresAuth: true } },
    { path: '/confirmation', name: 'confirmation', component: () => import('@/pages/ConfirmationPage.vue'), meta: { requiresAuth: true } },
    { path: '/a-propos', name: 'about', component: () => import('@/pages/AboutPage.vue') },
    { path: '/contact', name: 'contact', component: () => import('@/pages/ContactPage.vue') },
    { path: '/mentions-legales', name: 'legal-notice', component: () => import('@/pages/LegalNoticePage.vue') },
    { path: '/confidentialite', name: 'privacy-policy', component: () => import('@/pages/PrivacyPolicyPage.vue') },
    { path: '/connexion', name: 'login', component: () => import('@/pages/LoginPage.vue') },
    { path: '/inscription', name: 'register', component: () => import('@/pages/RegisterPage.vue') },
    {
      path: '/mon-compte',
      component: () => import('@/pages/dashboard/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', name: 'dashboard', component: () => import('@/pages/dashboard/DashboardHome.vue') },
        { path: 'commandes', name: 'my-orders', component: () => import('@/pages/dashboard/MyOrders.vue') },
        { path: 'commandes/:id', name: 'order-detail', component: () => import('@/pages/dashboard/OrderDetail.vue') },
        { path: 'favoris', name: 'favorites', component: () => import('@/pages/dashboard/MyFavorites.vue') },
        { path: 'profil', name: 'profile', component: () => import('@/pages/dashboard/MyProfile.vue') },
      ],
    },
    {
      path: '/admin',
      component: () => import('@/pages/admin/AdminLayout.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        { path: '', name: 'admin-dashboard', component: () => import('@/pages/admin/AdminDashboard.vue') },
        { path: 'produits', name: 'admin-products', component: () => import('@/pages/admin/AdminProducts.vue') },
        { path: 'commandes', name: 'admin-orders', component: () => import('@/pages/admin/AdminOrders.vue') },
        { path: 'clients', name: 'admin-clients', component: () => import('@/pages/admin/AdminClients.vue') },
        { path: 'paiements', name: 'admin-payments', component: () => import('@/pages/admin/AdminPayments.vue') },
        { path: 'avis', name: 'admin-reviews', component: () => import('@/pages/admin/AdminReviews.vue') },
        { path: 'contenu', name: 'admin-cms', component: () => import('@/pages/admin/AdminCms.vue') },
        { path: 'livraison', name: 'admin-shipping', component: () => import('@/pages/admin/AdminShipping.vue') },
      ],
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/pages/NotFoundPage.vue') },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (auth.loading) await auth.init()
  if (to.meta.requiresAuth && !auth.isAuthenticated) return { name: 'login', query: { redirect: to.fullPath } }
  if (to.meta.requiresAdmin && !auth.isAdmin) return { name: 'home' }
})

export default router
