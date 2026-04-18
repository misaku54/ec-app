import axios from "axios";

export const ApiClient = axios.create({
  //TODO:ここは環境ごとに切り替えられるようにしたい。
  baseURL: "http://localhost:8888/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 2000,
});
