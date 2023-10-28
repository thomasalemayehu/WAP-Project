const coloredConsole = require("cli-color");

const mongoose = require("mongoose");
const DATABASE_URI = process.env.DB_URL;
const dotEnv = require("dotenv");
dotEnv.config();
const ENV = process.env.ENV || "PRODUCTION";

const connectToDB = async () => {
  try {
    if (!DATABASE_URI || DATABASE_URI == "") {
      console.log(
        coloredConsole.bgRed.black.bold.italic(
          " Database URL not defined in ENV "
        )
      );
      process.exit(1);
    }
    if (ENV === "DEVELOPMENT") {
      console.log(
        coloredConsole.bgYellow.black.italic("Connecting to MongoDB ......")
      );
    }

    await mongoose.connect(DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    if (ENV === "DEVELOPMENT") {
      console.log(
        coloredConsole.bgYellow.black.italic("Connected to mongo DB...")
      );
    }
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};

module.exports = connectToDB;
