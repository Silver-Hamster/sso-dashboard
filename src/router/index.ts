import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router/auto'

function isAuthenticated() {
  // Replace this with your actual authentication check logic
  return !!document.cookie.split('; ').find(row => row.startsWith('accessToken='));
}

const routes: RouteRecordRaw[] = [
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
]

const router = createRouter({
  history: createWebHistory(import.meta.env.VUE_APP_BASE_URL),
  routes,
})

// Global before guard
router.beforeEach((to, from, next) => {
  if (to.name === 'Adminlogin' && isAuthenticated()) {
    next({ name: 'AdminHome' });
  } else if (to.name !== 'Adminlogin' && !isAuthenticated()) {
    next({ name: 'Adminlogin' });
  } else {
    next();
  }
});

export default router