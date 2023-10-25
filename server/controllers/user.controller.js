const User = require("../models/User");
const JWTHandler = require("../utils/JWTHandler");
const bcrypt = require("bcrypt");

const controller = {
  register: async (req, res) => {
    const { userName, ssn, email, password,name} = req.body;

    console.log(userName,ssn,email,password,name);
    if (!userName) {
      throw new Error("Invalid username used");
    } else if (!password) {
      throw new Error("Password not provided");
    }
    const newUser = await User.create({ userName, password, ssn, email,name });

    const jwt = JWTHandler.generate(newUser.userName);
    res
      .status(201)
      .json({
        id: newUser.id,
        userName: newUser.userName,
        token: jwt,
        ssn: newUser.ssn,
        email: newUser.email,
        name:newUser.name,
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

    if(!user) {
      res.status(404).json({ message: "Invalid username and/or password" });
      return;
    }

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
