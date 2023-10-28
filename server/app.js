const express = require("express");

const app = express();

const dotEnv = require("dotenv");
dotEnv.config();

const coloredConsole = require("cli-color");

const morgan = require("morgan");

const PORT = process.env.PORT || 3000;
const ENV = process.env.ENV || "DEVELOPMENT";
const cors = require("cors");

const connectToDB = require("./config/db.config");

const rateLimiter = require("./config/rate.config");

require("express-async-errors");
//
const errorMiddleware = require("./middleware/error.middleware");
const pageNotFoundMiddleware = require("./middleware/pageNotFound.middleware");


//
const userRoutes = require("./routes/user.routes");
const accountRoutes = require("./routes/account.routes");

//
app.use(rateLimiter);
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/auth", userRoutes);
app.use("/account", accountRoutes);

app.use(errorMiddleware);

app.use("*", pageNotFoundMiddleware);

app.listen(PORT, () => {
  connectToDB().then(() => {
    console.log(
      coloredConsole.bgGreen.black.italic(` Sever is live at ${PORT} ...`)
    );
  });
});
