import axios from "axios";

axios.defaults.baseURL = "http://localhost:3001"
const baseUrl = "/api/users";

const getBlogs = async (username) => {
    const response = await axios.get(baseUrl);
    return response.data.find(user => user.username === username);
}

export default { getBlogs }