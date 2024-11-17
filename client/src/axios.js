import axios from "axios";

export const makeRequest = axios.create({
  baseURL: "https://alumniapp-server.vercel.app/api/",
  withCredentials: true,
});
