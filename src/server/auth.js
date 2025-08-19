import Api from "./api";

export const login =(FormData)=>{
    return Api.post("/login",FormData);

};

export const signup =(FormData)=>{
    return Api.post("/signup",FormData);
}
