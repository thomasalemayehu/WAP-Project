function registerEventListeners() {
  document.getElementById("sign-in-form").addEventListener("submit", (e) => {
    e.preventDefault();
    login();
  });
}

window.onload = registerEventListeners;

async function login() {
  const userNameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  const loginButton = document.getElementById("login-button");
  loginButton.innerText = "Logging in...";
  loginButton.setAttribute("disabled", true);

  const body = document.getElementsByTagName("body")[0];

  const loginInfo = {
    userName: userNameInput.value,
    password: passwordInput.value,
  };

  const response = await loginRequest(loginInfo);
  const responseBody = await response.json();
  if (response.status === 200) {
    saveToSessionStorage("userInfo", responseBody);
    redirectTo("./index.htm");
  } else {
    alertDanger(body, responseBody.message);
  }
  loginButton.removeAttribute("disabled");
  loginButton.innerText = "Login";
}

async function loginRequest(userInfo) {
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInfo),
  };
  const response = await fetch(
    `${BASE_API_URL}/auth/login`,
    options,
    REQUEST_TIMEOUT
  );
  return response;
}
