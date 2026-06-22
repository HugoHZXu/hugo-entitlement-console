import { createRouter, createWebHistory } from 'vue-router';

import AppLayout from '@/layouts/AppLayout.vue';
import AllocatedUsersPage from '@/pages/allocated-users/AllocatedUsersPage.vue';
import EntitlementListPage from '@/pages/entitlements/EntitlementListPage.vue';
import ProductDetailPage from '@/pages/products/ProductDetailPage.vue';
import ProductListPage from '@/pages/products/ProductListPage.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '',
          redirect: '/products',
        },
        {
          path: 'products',
          name: 'products',
          component: ProductListPage,
        },
        {
          path: 'products/:productId',
          name: 'product-detail',
          component: ProductDetailPage,
          props: true,
        },
        {
          path: 'entitlements',
          name: 'entitlements',
          component: EntitlementListPage,
        },
        {
          path: 'products/:productId/allocated-users',
          name: 'allocated-users',
          component: AllocatedUsersPage,
          props: true,
        },
      ],
    },
  ],
});
