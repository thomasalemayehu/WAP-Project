const User = require("../models/User");
const JWTHandler = require("../utils/JWTHandler");
const bcrypt = require("bcrypt");

const controller = {
  register: async (req, res) => {
    const { userName, password } = req.body;
    if (!userName) {
      throw new Error("Invalid username used");
    } else if (!password) {
      throw new Error("Password not provided");
    }
    const newUser = await User.create({ userName, password });

    const jwt = JWTHandler.generate(newUser.userName);
    res
      .status(201)
      .json({ id: newUser.id, serName: newUser.userName, token: jwt });
  },

  
  login: async (req, res) => {
    const { userName, password } = req.body;

    if (!userName) {
      throw new Error("Invalid username used");
    } else if (!password) {
      throw new Error("Password not provided");
    }

    const user = await User.findOne({ userName: userName });

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      res.status(404).json({ message: "Invalid username and/or password" });
      return;
    }
    const jwt = JWTHandler.generate(user.userName);
    res.status(200).json({ id: user.id, userName, token: jwt });
  },
};

module.exports = controller;
