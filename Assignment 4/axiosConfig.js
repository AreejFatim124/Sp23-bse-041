const axios=require("axios") ;

const axiosInstance = axios.create({
  baseURL: "http://localhost:8642", // Your backend URL
  withCredentials: true, // Ensure cookies are sent with requests
});

module.exports= axiosInstance;
