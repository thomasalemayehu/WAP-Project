window.onload = getData;

async function getData() {
  const userInfo = getFromSessionStorage("userInfo");

  if (!userInfo || !userInfo.accountId) {
    redirectTo("./sign-in.htm");
  }

  const accountId = userInfo.accountId;

  const data = {
    senderId: accountId,
  };

  const response = await getDataRequest(data);
  const responseBody = await response.json();

  if (response.status !== 200) {
    return alertDanger(body, responseBody.message);
  }

  insertData("dash-card-balance", responseBody.balance);
  insertData("dash-card-deposits", responseBody.totalDeposit);
  insertData("dash-card-withdrawals", responseBody.totalWithdraw);
  insertData("dash-card-atm", responseBody.atmTransactions);
  insertData("dash-card-transfer-in", responseBody.transferIns);
  insertData("dash-card-transfer-out", responseBody.transferOuts);

  let cardNo = String(responseBody.card.cardNumber);
  let card1 = cardNo.substring(0, 4);
  let card2 = cardNo.substring(4, 8);
  let card3 = cardNo.substring(8, 12);
  let card4 = cardNo.substring(12, 16);

  insertData("card-1", card1);
  insertData("card-2", card2);
  insertData("card-3", card3);
  insertData("card-4", card4);

  insertData("card-cvv", responseBody.card.cvv || "000");
}

function insertData(id, data) {
  document.getElementById(id).innerHTML = data;
}

async function getDataRequest(data) {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  const response = await fetch(
    `${BASE_API_URL}/account/${data.senderId}/info`,
    options
  );

  return response;
}
