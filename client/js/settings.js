function registerEventListeners() {
  populateData();
  document.getElementById("profile-form").addEventListener("submit", (e) => {
    e.preventDefault();
    updateProfile();
  });
}

window.onload = registerEventListeners;

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

async function updateRequest(data) {
  const options = {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
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
