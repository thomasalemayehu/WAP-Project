window.onload = loadTransactions;

document.getElementById("search-button").addEventListener("click", (e) => {
  e.preventDefault();
  loadTransactions();
});

document.getElementById("clear-button").addEventListener("click", (e) => {
  document.getElementById("search-form").reset();
  loadTransactions();
});

async function loadTransactions() {
  const minAmountFilter = document.getElementById("min-amount").value;
  const maxAmountFilter = document.getElementById("max-amount").value;
  const startDate = document.getElementById("start-date").value;
  const endDate = document.getElementById("end-date").value;
  const accountNumber = document.getElementById("account-number").value;
  const transactionType = document.getElementsByClassName(
    "transaction-type-class"
  )[0].value;
  const userInfo = getFromSessionStorage("userInfo");
  if (!userInfo) redirectTo("./sign-in.htm");

  const { accountId } = userInfo;

  const response = await loadTransactionRequest(
    accountId,
    minAmountFilter,
    maxAmountFilter,
    startDate,
    endDate,
    accountNumber,
    transactionType
  );

  const responseBody = await response.json();

  if (response.status == 200) {
    renderTransactions(responseBody);
  } else {
    alertDanger("Error Loading Transactions");
  }
}
function renderTransactions(allTransactions) {
  const transactionTable = document.getElementById("transaction-body");
  transactionTable.innerHTML = "";
  if (allTransactions.length > 0) {
    allTransactions.forEach((transaction) => {
      const tr = document.createElement("tr");
      const transactionId = document.createElement("td");
      const date = document.createElement("td");
      const type = document.createElement("td");
      const amount = document.createElement("td");
      const routing = document.createElement("td");
      const account = document.createElement("td");
      const description = document.createElement("td");

      transactionId.innerText = transaction.id.toString();
      date.innerText = new Date(transaction.date).toLocaleString();
      type.innerText = transaction.transactionType;
      amount.innerText = transaction.amount;
      routing.innerText = transaction.routingNumber ?? "-";
      account.innerText = transaction.accountNumber ?? "-";
      description.innerText = transaction.description;

      tr.append(
        transactionId,
        date,
        type,
        amount,
        account,
        routing,
        description
      );
      transactionTable.append(tr);
    });
  }
}

async function loadTransactionRequest(
  accountId,
  minAmount,
  maxAmount,
  startDate,
  endDate,
  accountNumber,
  transactionType
) {
  const response = await fetch(
    `${BASE_API_URL}/account/${accountId}/filter?maxAmount=${maxAmount}&minAmount=${minAmount}&startDate=${startDate}&endDate=${endDate}&accountNumber=${accountNumber}&transactionType=${transactionType}`,
    {
      headers: {
        Authorization: getToken(),
      },
    }
  );

  return response;
}
