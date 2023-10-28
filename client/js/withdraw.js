function registerEventListeners() {
  document.getElementById("withdraw-form").addEventListener("submit", (e) => {
    e.preventDefault();
    withdraw();
  });
}

window.onload = registerEventListeners;

async function withdraw() {
  const form = document.getElementById("withdraw-form");
  const routingNumberInput = document.getElementById("routing-number");
  const accountNumberInput = document.getElementById("account-number");
  const amountInput = document.getElementById("amount");

  const button = document.getElementById("withdraw-button");
  button.innerText = "Withdrawing...";
  button.setAttribute("disabled", true);

  const body = document.getElementById("main-content");

  const userInfo = getFromSessionStorage("userInfo");

  if (!userInfo || !userInfo.accountId) {
    redirectTo("./sign-in.htm");
  }

  const accountId = userInfo.accountId;

  const data = {
    amount: amountInput.value,
    routingNumber: routingNumberInput.value,
    accountNumber: accountNumberInput.value,
    senderId: accountId,
  };

  const response = await updateRequest(data);
  const responseBody = await response.json();

  if (response.status == 200) {
    alertSuccess(body, "Withdraw successful");
  } else {
    alertDanger(body, responseBody.message);
  }

  button.removeAttribute("disabled");
  button.innerText = "Withdraw";
  form.reset();
}

async function updateRequest(data) {
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  };

  const response = await fetch(
    `${BASE_API_URL}/account/${data.senderId}/withdraw`,
    options
  );

  return response;
}
