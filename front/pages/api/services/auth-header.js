const authHeader = () => {
  if (typeof window !== "undefined") {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user !== null && user !== "" && user !== "undefined") {
      var header = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.token + "",
        },
      };
    } else {
      var header = "";
    }
  } else {
    var header = "";
  }
  return header;
};
const authHeadere = {
  authHeader,
};

export default authHeadere;
