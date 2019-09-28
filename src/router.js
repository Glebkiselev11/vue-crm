import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase/app' // Он нам в роуторе нужен для проверок при переходах между страницами

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      meta: {layout: 'empty'},
      component: () => import('./views/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      meta: {layout: 'empty'},
      component: () => import('./views/Register.vue')
    },
    {
      path: '/',
      name: 'home',
      meta: {layout: 'main', auth: true},
      component: () => import('./views/Home.vue')
    },
    {
      path: '/categories',
      name: 'categories',
      meta: {layout: 'main', auth: true},
      component: () => import('./views/Categories.vue')
    },
    {
      path: '/detail/:id',
      name: 'detail',
      meta: {layout: 'main', auth: true},
      component: () => import('./views/Detail.vue')
    },
    {
      path: '/history',
      name: 'history',
      meta: {layout: 'main', auth: true},
      component: () => import('./views/History.vue')
    },
    {
      path: '/planning',
      name: 'planning',
      meta: {layout: 'main', auth: true},
      component: () => import('./views/Planning.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      meta: {layout: 'main', auth: true},
      component: () => import('./views/Profile.vue')
    },
    {
      path: '/record',
      name: 'record',
      meta: {layout: 'main', auth: true},
      component: () => import('./views/Record.vue')
    }
    
    
  ]
})

// beofreEach - это метод который вызывается каждый раз перед сменой роутера
// to - это куда мы переходим
// from - это откуда мы переходим
// next - это функция которую мы должны будем вызвать если проверки пройдены, 
// а так же мы можем с помощью этой функции редиректнуть пользователя куда нужно
// например на страницу логина
router.beforeEach((to, from, next) => {
  // Смотрим есть ли что-то в currentUser, если что-то есть то технически пользователь находится в системе
  const currentUser = firebase.auth().currentUser

  // Проверяем требует ли данная страница авторизации, проходясь some() по объекту и проверяя  
  // там поле auth, если оно стоит в значении true, то авторизация для этой страницы требуется
  const requireAuth = to.matched.some(record => record.meta.auth)

  // Если нет авторизации (!currentUser) а страница требует авторизации (requireAuth)
  if (requireAuth && !currentUser) {
    // То мы редиректим пользователя на страницу авторизации с get параметром (?message=login) который 
    // выведет системное сообщение из файла '@/utils/messages.js' там в объекте по ключу login лежит нужный 
    // текст системного сообщения
    next('/login?message=login')
  } else {
    // А если все ок, то просто вызываем next() которое успешно отправит пользователя на ту страницу на которую он хотел
    next()
  }
})

export default router
