function registerEventListeners() {
  document.getElementById("deposit-form").addEventListener("submit", (e) => {
    e.preventDefault();
    deposit();
  });
}

window.onload = registerEventListeners;

async function deposit() {
  const form = document.getElementById("deposit-form");
  const routingNumberInput = document.getElementById("routing-number");
  const accountNumberInput = document.getElementById("account-number");
  const amountInput = document.getElementById("amount");

  const button = document.getElementById("deposit-button");
  button.innerText = "Depositing...";
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

  const response = await depositRequest(data);
  const responseBody = await response.json();

  if (response.status == 200) {
    alertSuccess(body, "Deposit successful");
  } else {
    alertDanger(body, responseBody.message);
  }

  button.removeAttribute("disabled");
  button.innerText = "Deposit";
  form.reset();
}

async function depositRequest(data) {
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(
    `${BASE_API_URL}/account/${data.senderId}/deposit`,
    options
  );

  return response;
}
