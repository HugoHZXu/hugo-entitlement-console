import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    currentAccount: {
      id: 'acct-northstar-learning',
      name: 'Northstar Learning Group',
    },
    currentAdmin: {
      id: 'admin-riley',
      name: 'Riley Admin',
      email: 'riley.admin@example.com',
    },
  }),
});
