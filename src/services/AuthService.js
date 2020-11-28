import http from "../http-common";

class AuthService {
  login(user) {
    return http
      .post('/auth', {
        username: user.username,
        password: user.password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem('user', JSON.stringify(response.data));
          localStorage.setItem('userData', atob(response.data.accessToken.split('.')[1]));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('userData');
  }
}

export default new AuthService();