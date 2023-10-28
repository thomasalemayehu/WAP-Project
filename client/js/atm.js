function registerEventListeners() {
  document
    .getElementById("atm-withdraw-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      withdrawATM();
    });
}

window.onload = registerEventListeners;

async function withdrawATM() {
  const form = document.getElementById("withdraw-form");
  const cardNumberInput = document.getElementById("card");
  const pinInput = document.getElementById("pin");
  const amountInput = document.getElementById("amount");

  const withdrawButton = document.getElementById("withdraw-atm-button");
  withdrawButton.innerText = "Withdrawing...";
  withdrawButton.setAttribute("disabled", true);

  const withdrawInfo = {
    cardNumber: cardNumberInput.value,
    pin: pinInput.value,
    amount: amountInput.value,
  };

  const body = document.getElementById("atm-withdraw-form");
  const response = await withdrawATMRequest(withdrawInfo);
  const responseBody = await response.json();

  if (response.status == 200) {
    alertSuccess(body, "Money withdrawn successfully");
    form.reset();
  } else {
    alertDanger(body, `${responseBody.message}`);
  }

  withdrawButton.removeAttribute("disabled");
  withdrawButton.innerText = "Withdraw";
}

async function withdrawATMRequest(withdrawInfo) {
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(withdrawInfo),
  };
  const response = await fetch(`${BASE_API_URL}/account/atm`, options);
  return response;
}
