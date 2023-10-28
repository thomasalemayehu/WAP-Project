const Account = require("../models/Account");
const User = require("../models/User");
const controller = {
  createAccount: async (req, res) => {
    const { userId, balance } = req.body;

    const account = await Account.create({
      userId,
      balance,
    });

    res.status(201).json(account);
  },

  getAccountById: async (req, res) => {
    const { id } = req.params;

    const account = await Account.findOne({ _id: id });

    res.status(200).json(account);
  },

  updateById: async (req, res) => {
    const { id } = req.params;

    if (!id) {
      throw new Error("Account Id not provided for update");
    }

    const { balance, accountType } = req.body;

    const account = await Account.findOneAndUpdate(
      { _id: id },
      { balance, accountType },
      { new: true }
    );

    res.status(200).json(account);
  },

  deleteById: async (req, res) => {
    const { id } = req.params;

    if (!id) {
      throw new Error("Account Id not provided for update");
    }

    const account = await Account.findOne({ _id: id });
    await account.deleteOne();

    res.status(200).json(account);
  },

  withdraw: async (req, res) => {
    const { id } = req.params;
    const { routingNumber, accountNumber, amount } = req.body;

    if (!id) throw new Error("Account Id not provided for withdraw");
    else if (!amount) throw new Error("Amount to withdraw not provided");
    else if (!routingNumber)
      throw new Error("Routing Number is required for withdraw");
    else if (!accountNumber)
      throw new Error("Account Number is required for withdraw");

    const account = await Account.findOne({ _id: id });

    await account.withdraw(amount, routingNumber, accountNumber);
    await account.save();

    res.status(200).json(account);
  },

  deposit: async (req, res) => {
    const { id } = req.params;
    const { routingNumber, accountNumber, amount } = req.body;

    if (!id) throw new Error("Account Id not provided for withdraw");
    else if (!amount) throw new Error("Amount to withdraw not provided");
    else if (!routingNumber)
      throw new Error("Routing Number is required for withdraw");
    else if (!accountNumber)
      throw new Error("Account Number is required for withdraw");

    const account = await Account.findOne({ _id: id });

    await account.deposit(amount, routingNumber, accountNumber);
    await account.save();

    res.status(200).json(account);
  },

  getTransaction: async (req, res) => {
    const { id } = req.params;

    if (!id) throw new Error("Account id is required to view transaction");

    const account = await Account.findOne({ _id: id });

    if (!account) {
      res.status(404).json({ message: "Account not found" });
      return;
    }
    res.status(200).json(account.transactions);
  },

  getTransactionById: async (req, res) => {
    const { id, transactionId } = req.params;

    if (!id) throw new Error("Account id is required to view transaction");
    else if (!transactionId)
      throw new Error("Transaction id is required to view transaction");

    const account = await Account.findOne({ _id: id });
    if (!account) {
      res.status(404).json({ message: "Account not found" });
      return;
    }

    let transaction = account.transactions.filter(
      (transactionInfo) => transactionInfo._id.toString() === transactionId
    );

    if (transaction.length > 0) transaction = transaction[0];
    res.status(200).json(transaction);
  },

  transferById: async (req, res) => {
    const { senderId, receiverId } = req.params;
    const { amount } = req.query;

    if (!senderId) {
      throw new Error("Sender Id not found for transfer");
    } else if (!receiverId) {
      throw new Error("Receiver Id not found for transfer");
    } else if (!amount) {
      throw new Error("Amount to transfer not found");
    }

    const senderAccount = await Account.findOne({ _id: senderId });

    if (!senderAccount) {
      throw new Error("Sender Account not found.");
    }
    console.log(senderAccount);
    const receiverUser = await User.findOne({ userName: receiverId });

    if (!receiverUser) throw new Error("Receiver user not found");

    const receiverAccount = await Account.findOne({ userId: receiverUser.id });

    console.log(receiverAccount);

    if (!receiverAccount) {
      throw new Error("Receiver Account not found.");
    }

    await senderAccount.transfer(amount, receiverAccount);

    res.status(200).json(senderAccount);
  },

  generateCard: async (req, res) => {
    const { id } = req.params;

    if (!id) throw new Error("Account id is required to generate card");

    const account = await Account.findOne({ _id: id });

    if (!account) {
      res.status(404).json({ message: "Account not found" });
    }

    const card = await account.generateATM();
    await account.save();

    res.status(201).json(card);
  },

  withdrawATM: async (req, res) => {
    const { cardNumber, pin, amount } = req.body;

    if (!cardNumber)
      throw new Error("Card Number is required to make ATM withdraw");
    else if (!pin) throw new Error("Pin is required to make ATM withdraw");
    else if (!amount)
      throw new Error("Amount is required to make ATM withdraw");

    const account = await Account.findOne({ "card.cardNumber": cardNumber });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    await account.withdrawATM(amount, cardNumber, pin);

    res.status(200).json(account);
  },

  accountInfo: async (req, res) => {
    const { id } = req.params;
    const account = await Account.findOne({ _id: id });

    if (!account) throw new Error("Account not found");
    const result = {};

    const transactions = account.transactions;
    result.balance = account.balance;
    result.totalWithdraw = transactions
      .filter((transaction) => transaction.transactionType == "Withdraw")
      .reduce((sum, transaction) => (sum += transaction.amount), 0);
    result.totalDeposit = transactions
      .filter((transaction) => transaction.transactionType == "Deposit")
      .reduce((sum, transaction) => (sum += transaction.amount), 0);
    result.atmTransactions = transactions
      .filter((transaction) => transaction.transactionType == "ATM")
      .reduce((sum, transaction) => (sum += transaction.amount), 0);
    result.transferIns = transactions
      .filter((transaction) => transaction.transactionType == "Transfer In")
      .reduce((sum, transaction) => (sum += transaction.amount), 0);
    result.transferOuts = transactions
      .filter((transaction) => transaction.transactionType == "Transfer Out")
      .reduce((sum, transaction) => (sum += transaction.amount), 0);

    result.card = account.card;
    const { userId } = account;

    const user = await User.findOne({ _id: userId });

    if (!user) throw new Error("User not found");
    result.name = user.name;
    res.status(200).json(result);
  },

  filterTransaction: async (req, res) => {
    const { id } = req.params;

    if (!id) throw new Error("No user id provided");

    const {
      minAmount,
      maxAmount,
      startDate,
      endDate,
      transactionType,
      accountNumber,
    } = req.query;

    const account = await Account.findOne({ _id: id });

    if (!account) throw new Error("Account not found");

    let transactions = account.transactions;

    if (minAmount)
      transactions = transactions.filter(
        (transaction) => transaction.amount > minAmount
      );
    if (maxAmount)
      transactions = transactions.filter(
        (transaction) => transaction.amount < maxAmount
      );
    if (transactionType)
      transactions = transactions.filter(
        (transaction) => transaction.transactionType == transactionType
      );
    if (accountNumber)
      transactions = transactions.filter(
        (transaction) => transaction.accountNumber == accountNumber
      );

    res.status(200).json(transactions);
  },
};

module.exports = controller;
