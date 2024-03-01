function Register(username: string, password: string) {
  return fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/register`, {
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
