import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5017/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// MATCHES
export const getMatches = async () => {
  const res = await api.get("/matches");
  return res.data;
};
