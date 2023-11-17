const express = require("express");

const router = express.Router();
const accountController = require("../controllers/account.controller");

const authenticationMiddleware = require("../middleware/authentication.middleware");

router.post("/", authenticationMiddleware, accountController.createAccount);
router.get("/:id", authenticationMiddleware, accountController.getAccountById);
router.put("/:id", authenticationMiddleware, accountController.updateById);
router.delete("/:id", accountController.deleteById);

router.post(
  "/:id/withdraw",
  authenticationMiddleware,
  accountController.withdraw
);
router.post(
  "/:id/deposit",
  authenticationMiddleware,
  accountController.deposit
);
router.get(
  "/:id/transaction",
  authenticationMiddleware,
  accountController.getTransaction
);
router.get(
  "/:id/transaction/:transactionId",
  authenticationMiddleware,
  accountController.getTransactionById
);

router.get(
  "/:senderId/transfer/:receiverId",
  authenticationMiddleware,
  accountController.transferById
);
router.post("/:id/atm/generate", accountController.generateCard);
router.post("/atm", accountController.withdrawATM);
router.get(
  "/:id/info",
  authenticationMiddleware,
  accountController.accountInfo
);
router.get(
  "/:id/filter",
  authenticationMiddleware,
  accountController.filterTransaction
);

module.exports = router;
