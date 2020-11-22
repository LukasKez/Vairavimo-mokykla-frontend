import http from "../http-common";
import authHeader from './AuthHeader';

class UserDataService {
  getAll() {
    return http.get("/users", { headers: authHeader() });
  }

  get(id) {
    return http.get(`/users/${id}`);
  }

  create(data) {
    return http.post("/users", data);
  }

  update(id, data) {
    return http.put(`/users/${id}`, data);
  }

  delete(id) {
    return http.delete(`/users/${id}`);
  }

  // findByTitle(title) {
  //   return http.get(`/tutorials?title=${title}`);
  // }
}

export default new UserDataService();
