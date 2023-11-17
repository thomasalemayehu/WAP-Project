function registerEventListeners() {
  populateData();
  document.getElementById("profile-form").addEventListener("submit", (e) => {
    e.preventDefault();
    updateProfile();
  });

  document
    .getElementById("change-password-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      changePassword();
    });

  document
    .getElementById("delete-account-button")
    .addEventListener("click", (e) => {
      e.preventDefault();
      deleteAccount();
    });
}

window.onload = registerEventListeners;

async function deleteAccount() {
  const body = document.getElementById("main-content");

  const userInfo = getFromSessionStorage("userInfo");

  if (!userInfo || !userInfo.accountId) {
    redirectTo("./sign-in.htm");
  }

  const accountId = userInfo.accountId;

  const data = {
    senderId: accountId,
  };

  const response = await deleteAccountRequest(data);

  if (response.status == 200) {
    alertSuccess(body, "Password change successful");
    logout();
  } else {
    alertDanger(body, responseBody.message);
  }

  button.removeAttribute("disabled");
  button.innerText = "Change Password";
  form.reset();
}

async function changePassword() {
  const form = document.getElementById("change-password-form");
  const oldPasswordInput = document.getElementById("current-password");
  const passwordInput = document.getElementById("password");
  const confirmPassword = document.getElementById("confirm-password");

  const button = document.getElementById("change-password-button");
  button.innerText = "Updating...";
  button.setAttribute("disabled", true);

  if (confirmPassword.value != passwordInput.value) {
    alertDanger(body, "Passwords do not match");
    return;
  }

  const body = document.getElementById("main-content");

  const userInfo = getFromSessionStorage("userInfo");

  if (!userInfo || !userInfo.accountId) {
    redirectTo("./sign-in.htm");
  }

  const accountId = userInfo.accountId;

  const data = {
    oldPassword: oldPasswordInput.value,
    newPassword: passwordInput.value,
    senderId: accountId,
  };

  const response = await changePasswordRequest(data);
  const responseBody = await response.json();

  if (response.status == 200) {
    alertSuccess(body, "Password change successful");
  } else {
    alertDanger(body, responseBody.message);
  }

  button.removeAttribute("disabled");
  button.innerText = "Change Password";
  form.reset();
}

async function updateProfile() {
  const form = document.getElementById("profile-form");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");

  const button = document.getElementById("update-profile-button");
  button.innerText = "Updating...";
  button.setAttribute("disabled", true);

  const body = document.getElementById("main-content");

  const userInfo = getFromSessionStorage("userInfo");

  if (!userInfo || !userInfo.accountId) {
    redirectTo("./sign-in.htm");
  }

  const accountId = userInfo.accountId;

  const data = {
    name: nameInput.value,
    email: emailInput.value,
    senderId: accountId,
  };

  const response = await updateRequest(data);
  const responseBody = await response.json();

  if (response.status == 200) {
    alertSuccess(body, "Update successful");
  } else {
    alertDanger(body, responseBody.message);
  }

  button.removeAttribute("disabled");
  button.innerText = "Update";
  form.reset();
}

async function deleteAccountRequest(data) {
  const options = {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: getToken(),
    },
  };

  const response = await fetch(
    `${BASE_API_URL}/account/${data.senderId}`,
    options
  );

  return response;
}

async function changePasswordRequest(data) {
  const options = {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: getToken(),
    },

    body: JSON.stringify(data),
  };

  const response = await fetch(
    `${BASE_API_URL}/auth/${data.senderId}/reset`,
    options
  );

  return response;
}

async function updateRequest(data) {
  const options = {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: getToken(),
    },

    body: JSON.stringify(data),
  };

  const response = await fetch(
    `${BASE_API_URL}/auth/${data.senderId}/profile`,
    options
  );

  return response;
}

function populateData() {
  user = getFromSessionStorage("userInfo");

  if (!user || !user.accountId) {
    redirectTo("./sign-in.htm");
  }

  insertData("username", user.userName);
}

function insertData(id, data) {
  document.getElementById(id).value = data;
}
