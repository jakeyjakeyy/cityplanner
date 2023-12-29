function Register(username: string, password: string) {
  return fetch("http://localhost:8000/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  }).then((data) => {
    return data.json();
  });
}

export default Register;
