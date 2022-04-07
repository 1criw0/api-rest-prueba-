import axios from "axios";

const API_URL = "http://localhost:8000/user";
import authHeadere from "./auth-header";
const signup = (email, password) => {
  return axios
    .post(API_URL + "/signup", {
      email,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

async function login(name, password) {
  return axios
    .post(API_URL + "/Login", {
      name,
      password,
    })
    .then((response) => {
      if (response.data.message.token) {
        localStorage.setItem("user", JSON.stringify(response.data.message));
      }
    });
}

async function logout() {
  return axios
    .get(API_URL + "/Logout", {
      headers: authHeadere.authHeader().headers,
    })
    .then((response) => {
      if (response.data.status === "ok") {
        localStorage.removeItem("user");
      }
    });
}

async function getCurrentUser() {
  if (typeof window !== "undefined") {
    var tokenn = JSON.parse(localStorage.getItem("user"));
    if (tokenn === null || tokenn === "") {
      var token = "";
      return token;
    } else {
      try {
        await axios
          .get(API_URL + "/refresh_token", {
            headers: authHeadere.authHeader().headers,
          })
          .then((response) => {
            if (response.data.message.user === true) {
              return JSON.parse(localStorage.getItem("user"));
            } else {
              localStorage.removeItem("user");
              var token = "";
              return token;
            }
          });
      } catch (err) {
        localStorage.removeItem("user");
        var token = "";
        return token;
      }
    }
  }
}

const authService = {
  signup,
  login,
  logout,
  getCurrentUser,
};

export default authService;
