import AuthService from '../services/AuthService';

const user = JSON.parse(localStorage.getItem('user'));
const userData = JSON.parse(localStorage.getItem('userData'));
const initialState = user
  ? { status: { loggedIn: true }, user, userData }
  : { status: { loggedIn: false }, user: null, userData: null};

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    login({ commit }, user) {
      return AuthService.login(user).then(
        user => {
          commit('loginSuccess', user);
          return Promise.resolve(user);
        },
        error => {
          commit('loginFailure');
          return Promise.reject(error);
        }
      );
    },
    logout({ commit }) {
      AuthService.logout();
      commit('logout');
    },
  },
  mutations: {
    loginSuccess(state, user) {
      state.status.loggedIn = true;
      state.user = user;
      state.userData = JSON.parse(atob(user.accessToken.split('.')[1]));
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
      state.userData = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = null;
      state.userData = null;
    },
  }
};