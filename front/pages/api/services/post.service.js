import axios from "axios";
import authHeadere from "./auth-header";
const API_URL = "http://localhost:8000/asesor";
const API_URLL = "http://localhost:8000/user";
const getAllasesores = () => {
  return axios.get(API_URL + "/Allasesores", {
    headers: authHeadere.authHeader().headers,
  });
};
const insertAsesores = (data) => {
  return axios.post(API_URL + "/register", data, {
    headers: authHeadere.authHeader().headers,
  });
};

const Editasesor = (data) => {
  return axios.put(API_URL + "/actualizar", data, {
    headers: authHeadere.authHeader().headers,
  });
};
const Deleteasesor = (data) => {
  return axios.delete(API_URL + "/delete", {
    data,
    headers: authHeadere.authHeader().headers,
  });
};

const getAllusers = () => {
  return axios.get(API_URLL + "/getsuers", {
    headers: authHeadere.authHeader().headers,
  });
};
const insertuser = (data) => {
  return axios.post(API_URLL + "/register", data, {
    headers: authHeadere.authHeader().headers,
  });
};

const Edituser = (data) => {
  return axios.put(API_URLL + "/cambiostado", data, {
    headers: authHeadere.authHeader().headers,
  });
};
const Deleteuser = (data) => {
  return axios.delete(API_URLL + "/delete", {
    data,
    headers: authHeadere.authHeader().headers,
  });
};
const postService = {
  getAllasesores,
  insertAsesores,
  Editasesor,
  Deleteasesor,
  getAllusers,
  insertuser,
  Edituser,
  Deleteuser,
};

export default postService;
