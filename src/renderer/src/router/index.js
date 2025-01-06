import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),

  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    { name: 'Recommend', path: '/recommend', component: () => import('../views/Recommend.vue') },
    {
      name: 'Playlist',
      path: '/playlist/:id',
      component: () => import('../views/Playlist.vue'),
      props: true
    },
    {
      name: 'Artist',
      path: '/artist/:id',
      component: () => import('../views/Artist.vue'),
      props: true
    },
    {
      name: 'MV',
      path: '/mv/:id',
      component: () => import('../views/MV.vue'),
      props: true
    },
    {
      name: 'Album',
      path: '/album/:id',
      component: () => import('../views/Album.vue'),
      props: true
    },
    {
      name: 'Cloud',
      path: '/cloud',
      component: () => import('../views/Cloud.vue')
    },
    {
      name: 'ListenTogether',
      path: '/listentogether',
      component: () => import('../views/ListenTogether.vue')
    },
    {
      name: 'DailyRecommend',
      path: '/dailyrecommend',
      component: () => import('../views/DailyRecommend.vue')
    },
    {
      name: 'Search',
      path: '/search',
      component: () => import('../views/Search.vue'),
      props: true
    },
    {
      name: 'SearchDetial',
      path: ''
    },
    {
      name: 'Discover',
      path: '/discover',
      component: () => import('../views/Discover.vue'),
      props: true
    },
    {
      name: 'Library',
      path: '/library',
      component: () => import('../views/Library.vue')
    },
    {
      name: 'Contributors',
      path: '/contributors',
      component: () => import('../views/Contributors.vue')
    },
    {
      name: 'Setting',
      path: '/setting',
      component: () => import('../views/Setting.vue')
    },

    {
      name: 'DesktopLyric',
      path: '/desktoplyric',
      component: () => import('../views/DesktopLyric.vue')
    },
    {
      name: 'LocalMusic',
      path: '/localmusic',
      component: () => import('../views/LocalMusic.vue'),
      props: true
    }
  ]
})

export default router
