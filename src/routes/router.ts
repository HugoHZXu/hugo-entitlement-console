import { createRouter, createWebHistory } from 'vue-router';

import ActivityLogPage from '@/pages/activity-log/ActivityLogPage.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import AllocatedUsersPage from '@/pages/allocated-users/AllocatedUsersPage.vue';
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
          path: 'activity-log',
          name: 'activity-log',
          component: ActivityLogPage,
        },
        {
          path: 'products/:productId',
          name: 'product-detail',
          component: ProductDetailPage,
          props: true,
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
