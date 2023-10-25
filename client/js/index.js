window.onload = checkLoginStatus;

function checkLoginStatus() {
  const userInfo = getFromSessionStorage("userInfo");

  if (!userInfo || !userInfo.token) redirectTo("../sign-in.htm");
}
