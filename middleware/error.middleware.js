const coloredConsole = require("cli-color");
const ENV = process.env.ENV;
module.exports = (err,req,res,next)=>{
  let errorMessage = err.message ;
      console.log(
        coloredConsole.bgRed.white.bold("Custom Error Handing Middleware")
      );

      console.log(err);

      // if (err.message.includes("E11000")) errorMessage = ""
        res.status(500).json({ message: errorMessage });

}