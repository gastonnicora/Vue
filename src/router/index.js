import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuctionView from '../views/AuctionView.vue'
import ArticleView from '../views/ArticleView.vue'
import LoginView from '../views/user/LoginView.vue'
import ConfigView from '../views/Config.vue'
import ConfirmEmail from '../views/ConfirmEmail.vue'
import MyArticlesBought from '../views/article/myArticlesBought.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/auction/:uuid',
    name: 'auction',
    component: AuctionView
  },
  {
    path: '/confirmEmail/:uuid',
    name: 'confirmEmail',
    component: ConfirmEmail
  },
  {
    path: '/myAuction/:uuid',
    name: 'myAuction',
    component: ConfigView
  },
  {
    path: '/myAuction/:uuid/addArticle',
    name: 'addArticle',
    component: ConfigView
  },
  {
    path: '/myAuction/:uuid/myArticle/:article',
    name: 'myArticle',
    component: ConfigView
  },
  {
    path: '/myArticle/:uuid',
    name: 'myArticleB',
    component: ArticleView
  },
  {
    path: '/myAuction/:uuid/myArticle/:article/updateArticle',
    name: 'updateArticle',
    component: ConfigView
  },
  {
    path: '/start',
    name: 'start',
    component: LoginView
  },
  {
    path: '/myCompanies',
    name: 'myCompanies',
    component: ConfigView
  },
  {
    path: '/createCompany',
    name: 'createCompany',
    component: ConfigView
  },
  {
    path: '/updateCompany/:uuid',
    name: 'updateCompany',
    component: ConfigView
  },
  {
    path: '/bidForAuction/:uuid',
    name: 'bidForAuction',
    component: ConfigView
  },
  {
    path: '/bidForArticle/:uuid',
    name: 'bidForArticle',
    component: ConfigView
  },
  {
    path: '/myAuctions',
    name: 'myAuctions',
    component: ConfigView
  },
  {
    path: '/createAuction',
    name: 'createAuction',
    component: ConfigView
  },
  {
    path: '/updateAuction/:uuid',
    name: 'updateAuction',
    component: ConfigView
  },
  {
    path: '/updateUser',
    name: 'updateUser',
    component: ConfigView
  },
  {
    path: '/updatePass',
    name: 'updatePass',
    component: ConfigView
  },
  {
    path: '/article/:uuid',
    name: 'article',
    component: ArticleView
  },
  {
    path: '/myArticlesBought',
    name: 'myArticlesBought',
    component: MyArticlesBought
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  mode: 'history',
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
