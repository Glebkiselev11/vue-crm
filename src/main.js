import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Paginate from 'vuejs-paginate'
import App from './App.vue'
import router from './router'
import store from './store'
import dateFilter from '@/filters/date.filter'
import localizeFilter from '@/filters/localize.filter'
import messagePlugin from '@/utils/message.plugin'
import Loader from '@/components/app/Loader'
import './registerServiceWorker'
import 'materialize-css/dist/js/materialize.min'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import currencyFilter from '@/filters/currency.filter'
import tooltipDirective from '@/directives/tooltip.directive'

Vue.config.productionTip = false

Vue.use(messagePlugin)
Vue.use(Vuelidate)
Vue.filter('date', dateFilter) // Фильтр для даты
Vue.filter('localize', localizeFilter) // Фильтр для локализации
Vue.filter('currency', currencyFilter) // Фильтр для валюты
Vue.directive('tooltip', tooltipDirective)
Vue.component('Loader', Loader)
Vue.component('Paginate', Paginate)

firebase.initializeApp({
  apiKey: "AIzaSyCmcQ5c2CfsrD_bBN35Hs6v8RfFN6qFePE",
  authDomain: "vue-crm-glebkiselev11.firebaseapp.com",
  databaseURL: "https://vue-crm-glebkiselev11.firebaseio.com",
  projectId: "vue-crm-glebkiselev11",
  storageBucket: "",
  messagingSenderId: "390172976505",
  appId: "1:390172976505:web:3a53f5b3c9383419da3ba8"
})

let app

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
  
})


