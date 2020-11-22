import http from "../http-common";

class OfficeDataService {
  getAll() {
    return http.get("/offices");
  }

  get(id) {
    return http.get(`/offices/${id}`);
  }

  create(data) {
    return http.post("/offices", data);
  }

  update(id, data) {
    return http.put(`/offices/${id}`, data);
  }

  delete(id) {
    return http.delete(`/offices/${id}`);
  }
}

export default new OfficeDataService();
