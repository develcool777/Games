import { createRouter, createWebHashHistory } from 'vue-router';

const lazyLoad = (componentName: string) => {
  const pages = import.meta.glob('/src/views/*.vue');
  const key = `/src/views/${componentName}.vue`;
  return pages[key];
};

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: lazyLoad('Home'),
      meta: {
        title: 'Games',
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'PageNotFound',
      component: lazyLoad('PageNotFound'),
      meta: {
        title: 'Page Not Found',
      },
    },
    {
      path: '/tic-tac-toe',
      name: 'TicTacToe',
      component: lazyLoad('TicTacToe'),
      meta: {
        title: 'Tic Tac Toe',
      },
    },
  ],
});

export default router;
