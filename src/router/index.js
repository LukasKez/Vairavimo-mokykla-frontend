import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Users from '../views/UserList.vue'
import UserProfile from '../views/UserProfile.vue'
import UserLectures from '../views/UserLecturesCalendar.vue'
import Offices from '../views/offices/Index.vue'
import OfficeProfile from '../views/offices/Show.vue'
import OfficeEdit from '../views/offices/Edit.vue'
import OfficeCreate from '../views/offices/Create.vue'
import OfficeUsers from '../views/offices/Users.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/users',
    name: 'user-list',
    component: Users
  },
  {
    path: '/users/:id',
    name: 'user-profile',
    component: UserProfile
  },
  {
    path: '/users/:id/lectures',
    name: 'user-lectures',
    component: UserLectures
  },
  {
    path: '/offices',
    name: 'office-list',
    component: Offices
  },
  {
    path: '/offices/:id',
    name: 'office-profile',
    component: OfficeProfile
  },
  {
    path: '/offices/:id/edit',
    name: 'office-edit',
    component: OfficeEdit
  },
  {
    path: '/office/create',
    name: 'office-create',
    component: OfficeCreate
  },
  {
    path: '/offices/:id/users',
    name: 'office-users',
    component: OfficeUsers
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/', '/offices'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');

  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequired && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});
export default router