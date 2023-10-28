window.onload = loadTransactions;

document.getElementById("search-button").addEventListener("click", (e) => {
  e.preventDefault();
  applyFilters();
  renderTransactions();
});

let allTransactions = [];
let allTransactionsCopy = [];

function applyFilters() {
  const minAmountFilter = document.getElementById("min-amount").value;
  const maxAmountFilter = document.getElementById("max-amount").value;
  const startDate = document.getElementById("start-date").value;
  const accountNumber = document.getElementById("account-number").value;
  const transactionType = document.getElementById("transaction-type").value;


  allTransactions = allTransactions.filter(
    (transaction) => transaction.amount > minAmountFilter
  );

  console.log(allTransactions);
}
async function loadTransactions() {
  const userInfo = getFromSessionStorage("userInfo");
  if (!userInfo) redirectTo("./sign-in.htm");

  const { accountId } = userInfo;

  const response = await loadTransactionRequest(accountId);

  const responseBody = await response.json();

  if (response.status == 200) {
    allTransactions = responseBody;
    allTransactionsCopy = allTransactions;

    renderTransactions(allTransactions);
  } else {
    alertDanger("Error Loading Transactions");
  }
}
function renderTransactions(allTransactions) {
  const transactionTable = document.getElementById("transaction-body");
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
    date.innerText = transaction.date;
    type.innerText = transaction.transactionType;
    amount.innerText = transaction.amount;
    routing.innerText = transaction.routingNumber ?? "-";
    account.innerText = transaction.accountNumber ?? "-";
    description.innerText = transaction.description;

    tr.append(transactionId, date, type, amount, routing, account, description);
    transactionTable.append(tr);
  });
}

async function loadTransactionRequest(accountId) {
  const response = await fetch(
    `${BASE_API_URL}/account/${accountId}/transaction`
  );

  return response;
}
