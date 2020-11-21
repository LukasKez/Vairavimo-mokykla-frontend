import axios from "axios";

export default axios.create({
  baseURL: "https://vm-rest.herokuapp.com",
  headers: {
    "Content-type": "application/json"
  }
});
