function registerEventListeners() {
  document.getElementById("transfer-form").addEventListener("submit", (e) => {
    e.preventDefault();
    transfer();
  });
}

window.onload = registerEventListeners;

async function transfer() {
  const transferForm = document.getElementById("transfer-form");
  const receiverUserNameInput = document.getElementById("username");

  const amountInput = document.getElementById("amount");

  const transferButton = document.getElementById("transfer-button");
  transferButton.innerText = "Transferring...";
  transferButton.setAttribute("disabled", true);

  const body = document.getElementById("main-content");

  const userInfo = getFromSessionStorage("userInfo");

  if (!userInfo || !userInfo.accountId) {
    redirectTo("./sign-in.htm");
  }

  const accountId = userInfo.accountId;

  const transferInfo = {
    amount: amountInput.value,
    senderId: accountId,
    receiverId: receiverUserNameInput.value,
  };

  const response = await transferRequest(transferInfo);
  const responseBody = await response.json();

  if (response.status == 200) {
    alertSuccess(body, "Transfer successful");
  } else {
    alertDanger(body, responseBody.message);
  }

  transferButton.removeAttribute("disabled");
  transferButton.innerText = "Transfer";
  transferForm.reset();
}

async function transferRequest(transferInfo) {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(
    `${BASE_API_URL}/account/${transferInfo.senderId}/transfer/${transferInfo.receiverId}?amount=${transferInfo.amount}`,
    options
  );

  return response;
}
