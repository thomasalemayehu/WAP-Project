const express = require("express");

const router = express.Router();
const accountController = require("../controllers/account.controller");

router.post("/", accountController.createAccount);
router.get("/:id", accountController.getAccountById);
router.put("/:id", accountController.updateById);
router.delete("/:id", accountController.deleteById);

router.post("/id/withdraw/:id", accountController.withdraw);
router.post("/id/deposit/:id", accountController.deposit);
router.get("/:id/transaction", accountController.getTransaction);
router.get(
  "/:id/transaction/:transactionId",
  accountController.getTransactionById
);

router.get("/:senderId/transfer/:receiverId", accountController.transferById);
router.post("/:id/atm/generate", accountController.generateCard);
router.post("/atm", accountController.withdrawATM);
module.exports = router;
