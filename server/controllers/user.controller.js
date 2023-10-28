const User = require("../models/User");
const Account = require("../models/Account");
const JWTHandler = require("../utils/JWTHandler");
const bcrypt = require("bcrypt");

const controller = {
  
  register: async (req, res) => {
    const { userName, ssn, email, password, name } = req.body;

    if (!userName) {
      throw new Error("Invalid username used");
    } else if (!password) {
      throw new Error("Password not provided");
    }
    const newUser = await User.create({ userName, password, ssn, email, name });

    const jwt = JWTHandler.generate(newUser.userName);
    const id = newUser.id;
    const balance = 0;
    let account = await Account.create({
      userId: id,
      balance,
    });
    const card = await account.generateATM();

    res.status(201).json({
      id: newUser.id,
      userName: newUser.userName,
      token: jwt,
      email: newUser.email,
      name: newUser.name,
      accountId: account.id,
      card: card,
    });
  },

  login: async (req, res) => {
    const { userName, password } = req.body;

    if (!userName) {
      throw new Error("Invalid username used");
    } else if (!password) {
      throw new Error("Password not provided");
    }

    const user = await User.findOne({ userName: userName });

    if (!user) {
      res.status(404).json({ message: "Invalid username and/or password" });
      return;
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      res.status(404).json({ message: "Invalid username and/or password" });
      return;
    }

    const jwt = JWTHandler.generate(user.userName);

    const accountInfo = await Account.findOne({ userId: user.id });
    console.log(accountInfo);
    res
      .status(200)
      .json({ id: user.id, userName, token: jwt, accountId: accountInfo.id });
  },
};

module.exports = controller;
