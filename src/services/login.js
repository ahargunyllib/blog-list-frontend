import axios from "axios";

axios.defaults.baseURL = "https://blog-list-backend-production.up.railway.app";
const baseUrl = "/api/login";

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials);
  return response.data;
};

export default { login };
