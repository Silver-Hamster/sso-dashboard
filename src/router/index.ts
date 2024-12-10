import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

function isAuthenticated(): boolean {
  // Replace this with your actual authentication check logic
  return !!document.cookie.split('; ').find((row) => row.startsWith('accessToken='));
}

// Define valid route names as a union type
type RouteNames =
  | 'AdminHome'
  | 'AdminOffices'
  | 'AdminOfficesCreate'
  | 'AdminOfficesEdit'
  | 'AdminUsers'
  | 'AdminUserCreate'
  | 'AdminUserEdit'
  | 'Adminlogin';

const routes: Array<RouteRecordRaw & { name: RouteNames }> = [
  {
    path: '/',
    name: 'AdminHome',
    component: () => import('../pages/admin/pages/index.vue'),
  },
  {
    path: '/admin/offices',
    name: 'AdminOffices',
    component: () => import('../pages/admin/pages/office/index.vue'),
  },
  {
    path: '/admin/offices/create',
    name: 'AdminOfficesCreate',
    component: () => import('../pages/admin/pages/office/create/index.vue'),
  },
  {
    path: '/admin/offices/edit/:id',
    name: 'AdminOfficesEdit',
    component: () => import('../pages/admin/pages/office/edit/index.vue'),
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import('../pages/admin/pages/user/index.vue'),
  },
  {
    path: '/admin/users/create',
    name: 'AdminUserCreate',
    component: () => import('../pages/admin/pages/user/create/index.vue'),
  },
  {
    path: '/admin/users/edit/:id',
    name: 'AdminUserEdit',
    component: () => import('../pages/admin/pages/user/edit/index.vue'),
  },
  {
    path: '/admin/login',
    name: 'Adminlogin',
    component: () => import('../pages/admin/pages/auth/login.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VUE_APP_BASE_URL),
  routes,
});

// Global before guard
router.beforeEach((to, from, next) => {
  if (to.name === 'Adminlogin' && isAuthenticated()) {
    next({ path: '/' }); // Redirect to AdminHome
  } else if (to.name !== 'Adminlogin' && !isAuthenticated()) {
    next({ path: '/admin/login' }); // Redirect to Adminlogin
  } else {
    next();
  }
});

export default router;
