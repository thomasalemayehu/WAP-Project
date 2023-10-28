const User = require("./models/User");
const Account = require("./models/Account");
const mongoose = require("mongoose");
const dotEnv = require("dotenv");
dotEnv.config();

const DATABASE_URI = process.env.DB_URL;

async function clearDB() {
  await mongoose.connection.db.dropDatabase();
}
async function populateData() {
  // create user one and user two

  const useOneInfo = {
    userName: "johndoe",
    ssn: 123456789,
    email: "john@gmail.com",
    password: "StrongPass@123",
    name: "John",
  };
  const johnDoe = await User.create(useOneInfo);
  const userOneAccountInfo = {
    userId: johnDoe._id,
    balance: 10000,
  };
  const johnAccount = await Account.create(userOneAccountInfo);
  const johnCard = await johnAccount.generateATM();

  const userTwoInfo = {
    userName: "marryjane",
    ssn: 133456789,
    email: "marry@gmail.com",
    password: "StrongPass@123",
    name: "Marry",
  };
  const marryJane = await User.create(userTwoInfo);
  const userTwoAccountInfo = {
    userId: marryJane._id,
    balance: 12000,
  };
  const marryAccount = await Account.create(userTwoAccountInfo);
  const marryCard = await marryAccount.generateATM();

  const userThreeInfo = {
    userName: "jakeross",
    ssn: 133466789,
    email: "jake@gmail.com",
    password: "StrongPass@123",
    name: "Jake",
  };
  const jakeRoss = await User.create(userThreeInfo);
  const userThreeAccountInfo = {
    userId: jakeRoss._id,
    balance: 8000,
  };
  const jakeAccount = await Account.create(userThreeAccountInfo);
  const jakeCard = await jakeAccount.generateATM();

  await johnAccount.deposit(300, "123456", "55678");
  await johnAccount.withdrawATM(100, johnCard.cardNumber, johnCard.pin);
  await johnAccount.withdraw(400, "123456", "55678");
  await johnAccount.transfer(2000, marryAccount);
  await johnAccount.transfer(100, jakeAccount);
  await johnAccount.deposit(450, "123456", "55678");
  await johnAccount.withdrawATM(320, johnCard.cardNumber, johnCard.pin);
  await johnAccount.withdraw(300, "123456", "55678");
  await johnAccount.save();

  await marryAccount.withdrawATM(220, marryCard.cardNumber, marryCard.pin);
  await marryAccount.withdrawATM(200, marryCard.cardNumber, marryCard.pin);
  await marryAccount.transfer(70, jakeAccount);
  await marryAccount.deposit(750, "122457", "25678");
  await marryAccount.withdraw(200, "133356", "25578");
  await marryAccount.transfer(500, johnAccount);
  await marryAccount.deposit(600, "133356", "25578");
  await marryAccount.save();

  await jakeAccount.withdraw(800, "123555", "345678");
  await jakeAccount.withdrawATM(340, jakeCard.cardNumber, jakeCard.pin);
  await jakeAccount.transfer(120, marryAccount);
  await jakeAccount.deposit(850, "123456", "55678");
  await jakeAccount.transfer(1000, johnAccount);
  await jakeAccount.withdrawATM(120, jakeCard.cardNumber, jakeCard.pin);
  await jakeAccount.deposit(320, "123555", "345678");
  await jakeAccount.withdraw(310, "123555", "345678");
  await jakeAccount.save();

  process.exit(0);
}

async function connect() {
  await mongoose.connect(DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
connect().then(async () => {
  await clearDB();
  await populateData();
});
