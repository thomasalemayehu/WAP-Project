document.getElementById("registerButton").addEventListener("click", (e) => {
  e.preventDefault();
  register();
});

async function register() {
  const nameInput = document.getElementById("name");
  const passwordInput = document.getElementById("password");
  const ssnInput = document.getElementById("ssn");
  const userNameInput = document.getElementById("username");
  const confirmPassword = document.getElementById("confirm-password");
  const emailInput = document.getElementById("email");

  const registerButton = document.getElementById("registerButton");
  registerButton.innerText = "Registering...";
  registerButton.setAttribute("disabled", true);

  const body = document.getElementsByTagName("body")[0];
  if (confirmPassword.value != passwordInput.value) {
    alertDanger(body, "Passwords do not match");
    return;
  }

  const userInfo = {
    email: emailInput.value,
    password: passwordInput.value,
    ssn: ssnInput.value,
    userName: userNameInput.value,
    name: nameInput.value,
  };

  const response = await registerRequest(userInfo);
  const responseBody = await response.json();
  if (response.status === 201) {
    alertSuccess(body, "Successful Registration");
    saveToSessionStorage(responseBody);
    redirectTo("../index.htm");
  } else {
    alertDanger(body, responseBody.message);
  }
  registerButton.removeAttribute("disabled");
  registerButton.innerText = "Register";
}

async function registerRequest(userInfo) {
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInfo),
  };
  const response = await fetch(`${BASE_API_URL}/auth/register`, options);
  return response;
}
