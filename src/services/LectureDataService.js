import http from "../http-common";
import authHeader from './AuthHeader';

class LectureDataService {
    getAll() {
        return http.get("/lectures", { headers: authHeader() });
    }

    get(id) {
        return http.get(`/lectures/${id}`, { headers: authHeader() });
    }

    create(data) {
        return http.post("/lectures", data, { headers: authHeader() });
    }

    update(id, data) {
        return http.put(`/lectures/${id}`, data, { headers: authHeader() });
    }

    delete(id) {
        return http.delete(`/lectures/${id}`, { headers: authHeader() });
    }
}

export default new LectureDataService();
