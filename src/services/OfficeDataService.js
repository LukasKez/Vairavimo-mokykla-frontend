import http from "../http-common";
import authHeader from "@/services/AuthHeader";

class OfficeDataService {
  getAll() {
    return http.get("/offices");
  }

  get(id) {
    return http.get(`/offices/${id}`, { headers: authHeader() });
  }

  create(data) {
    return http.post("/offices", data, { headers: authHeader() });
  }

  update(id, data) {
    return http.put(`/offices/${id}`, data, { headers: authHeader() });
  }

  delete(id) {
    return http.delete(`/offices/${id}`, { headers: authHeader() });
  }

  getUsers(id) {
    return http.get(`/offices/${id}/users`, { headers: authHeader() });
  }
}

export default new OfficeDataService();
