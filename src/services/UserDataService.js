import http from "../http-common";
import authHeader from './AuthHeader';

class UserDataService {
  getAll() {
    return http.get("/users", { headers: authHeader() });
  }

  get(id) {
    return http.get(`/users/${id}`, { headers: authHeader() });
  }

  create(data) {
    return http.post("/users", data, { headers: authHeader() });
  }

  update(id, data) {
    return http.put(`/users/${id}`, data, { headers: authHeader() });
  }

  delete(id) {
    return http.delete(`/users/${id}`, { headers: authHeader() });
  }

  getLectures(id) {
    return http.get(`/users/${id}/lectures`, { headers: authHeader() });
  }
}

export default new UserDataService();
