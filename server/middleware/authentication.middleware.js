module.exports = (req, res, next) => {

    console.log("Here")
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");

    const bearerToken = bearer[1];

    req.token = bearerToken;

    next();
  } else {
    res.status(401).json({ message: "Please Login" });
  }
};
