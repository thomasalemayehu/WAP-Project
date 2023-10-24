const coloredConsole = require("cli-color");
const ENV = process.env.ENV;
module.exports = (err,req,res,next)=>{
      console.log(
        coloredConsole.bgRed.white.bold("Custom Error Handing Middleware")
      );
      res.status(500).json({ message: err.message });

}