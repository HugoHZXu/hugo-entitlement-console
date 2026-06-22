<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';

import { useAppStore } from '@/shared/stores/app-store';

const appStore = useAppStore();
</script>

<template>
  <div class="app-layout" :class="{ 'app-layout--collapsed': appStore.sidebarCollapsed }">
    <aside class="app-sidebar" aria-label="Primary navigation">
      <div class="app-sidebar__brand">Entitlement Console</div>
      <nav class="app-sidebar__nav">
        <RouterLink to="/products">Products</RouterLink>
        <RouterLink to="/entitlements">Entitlements</RouterLink>
      </nav>
    </aside>

    <div class="app-shell">
      <header class="app-header">
        <button
          class="app-header__toggle"
          type="button"
          aria-label="Toggle sidebar"
          @click="appStore.toggleSidebar"
        >
          ≡
        </button>
        <div>
          <div class="app-header__account">{{ appStore.currentAccount.name }}</div>
          <div class="app-header__admin">{{ appStore.currentAdmin.name }}</div>
        </div>
      </header>

      <main class="app-main">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: grid;
  min-height: 100vh;
  grid-template-columns: 260px minmax(0, 1fr);
}

.app-layout--collapsed {
  grid-template-columns: 88px minmax(0, 1fr);
}

.app-sidebar {
  border-right: 1px solid #d8dde6;
  background: #ffffff;
}

.app-sidebar__brand {
  padding: 24px;
  color: #111827;
  font-size: 18px;
  font-weight: 700;
}

.app-layout--collapsed .app-sidebar__brand {
  font-size: 0;
}

.app-layout--collapsed .app-sidebar__brand::after {
  content: 'EC';
  font-size: 16px;
}

.app-sidebar__nav {
  display: grid;
  gap: 4px;
  padding: 8px 12px;
}

.app-sidebar__nav a {
  border-radius: 6px;
  padding: 10px 12px;
  color: #4b5563;
  font-weight: 600;
}

.app-sidebar__nav a.router-link-active {
  background: #eef2ff;
  color: #3730a3;
}

.app-layout--collapsed .app-sidebar__nav a {
  overflow: hidden;
  white-space: nowrap;
}

.app-shell {
  min-width: 0;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 72px;
  padding: 0 28px;
  border-bottom: 1px solid #d8dde6;
  background: #ffffff;
}

.app-header__toggle {
  width: 36px;
  height: 36px;
  border: 1px solid #d8dde6;
  border-radius: 6px;
  background: #ffffff;
  color: #374151;
  cursor: pointer;
}

.app-header__account {
  color: #111827;
  font-size: 14px;
  font-weight: 700;
  text-align: right;
}

.app-header__admin {
  margin-top: 2px;
  color: #6b7280;
  font-size: 13px;
  text-align: right;
}

.app-main {
  padding: 32px;
}

@media (max-width: 760px) {
  .app-layout,
  .app-layout--collapsed {
    grid-template-columns: 1fr;
  }

  .app-sidebar {
    display: none;
  }

  .app-main {
    padding: 20px;
  }
}
</style>
