import axios from "axios";

axios.defaults.baseURL = "https://blog-list-backend-production.up.railway.app";
const baseUrl = "/api/users";

const getBlogs = async (username) => {
  const response = await axios.get(baseUrl);
  return response.data.find((user) => user.username === username);
};

export default { getBlogs };
