const BASE_API_URL = "http://localhost:3000";
const REQUEST_TIMEOUT = 10000;

function alertDanger(container, message, timeout = 3000) {
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

function alertSuccess(container, message,timeout=3000) {
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


function redirectTo(relativePath){
    window.location.href = relativePath;
}

function saveToSessionStorage(key,value){
    sessionStorage.setItem(key,JSON.stringify(value));
}

function getFromSessionStorage(key){
    return JSON.parse(sessionStorage.getItem(key));
}

