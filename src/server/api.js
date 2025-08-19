// api create 

import axios from "axios";
// base url 
  const Api =axios.create({
    baseURL:"http://localhost:7000/api/auth",

  });

  Api.interceptors.request.use((req)=>{
    if(localStorage.getItem("token")){
      req.headers.Authorization=`Bearer ${localStorage.getItem("token")}`;
    }
    return req;
  })
  export default Api;
