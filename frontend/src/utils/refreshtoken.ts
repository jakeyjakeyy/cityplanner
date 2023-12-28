function RefreshToken() {
  const refresh = localStorage.getItem("refresh");
  return fetch("http://localhost:8000/api/token/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: refresh }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.detail === "Token is invalid or expired") {
        localStorage.removeItem("refresh");
        localStorage.removeItem("token");
        return { message: "Expired token" };
      }
      if (data.access) {
        localStorage.setItem("token", data.access);
        return { message: "Token refreshed" };
      } else {
        return { message: "Please log in again" };
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

export default RefreshToken;
