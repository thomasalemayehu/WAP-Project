const BASE_API_URL = "http://localhost:3000";
const REQUEST_TIMEOUT = 10000;

function alertDanger(container, message, timeout = 8000) {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.classList.add("alert-danger");
  alert.classList.add("fade");
  alert.classList.add("show");
  alert.setAttribute("role", "alert");
  alert.setAttribute("id", "alert");
  alert.innerText = message;

  container.prepend(alert);

  setTimeout(() => {
    const alerts = document.getElementsByClassName("alert");
    alerts[alerts.length - 1].remove();
  }, timeout);
}

function alertSuccess(container, message, timeout = 8000) {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.classList.add("alert-success");
  alert.classList.add("fade");
  alert.classList.add("show");
  alert.setAttribute("role", "alert");
  alert.setAttribute("id", "alert");
  alert.innerText = message;

  container.prepend(alert);

  setTimeout(() => {
    const alerts = document.getElementsByClassName("alert");
    alerts[alerts.length - 1].remove();
  }, timeout);
}

function redirectTo(relativePath) {
  window.location.href = relativePath;
}

function saveToSessionStorage(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

function getFromSessionStorage(key) {
  return JSON.parse(sessionStorage.getItem(key));
}

function getToken() {
  const userInfo = getFromSessionStorage("userInfo");
  if (!userInfo?.token) redirectTo("./sign-in.htm");
  return `Bearer ${userInfo.token}`;
}

function removeFromSessionStorage(key) {
  sessionStorage.removeItem(key);
}

function checkLoggedIn() {
  const pathname = window.location.pathname;
  const userInfo = getFromSessionStorage("userInfo");
  if (
    !pathname.startsWith("/sign-in.htm") &&
    !pathname.startsWith("/register.htm") &&
    !pathname.startsWith("/atm.htm") &&
    (!userInfo || !userInfo.accountId)
  ) {
    redirectTo("./sign-in.htm");
  }
}

function logout() {
  removeFromSessionStorage("userInfo");
  redirectTo("./sign-in.htm");
}

function setUserName() {
  const userInfo = getFromSessionStorage("userInfo");
  const userNames = document.getElementsByClassName("username-label");

  for (let i = 0; i < userNames.length; i++) {
    userNames[i].innerText = userInfo.userName;
  }
}

function alwaysRun() {
  checkLoggedIn();
  setUserName();
}

alwaysRun();
