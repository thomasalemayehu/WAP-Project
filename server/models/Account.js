const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const toJSONConfig = {
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;

      return ret;
    },
  },
};
const transactionSchema = mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  description: String,
  amount: Number,
  routingNumber:Number,
  accountNumber:Number,
  transactionType:{
    type: String,
    enum: ["Deposit", "Withdraw","Transfer"],
    required: true,
  },
}, {
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
});

const atmSchema = mongoose.Schema({
  cardNumber:Number,
  pin:String,
});

const accountSchema = mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      auto: true,
    },

    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },

    balance: {
      type: Number,
      default: 0,
    },

    transactions: [transactionSchema],
    cards:[atmSchema],
  },
  toJSONConfig
);

accountSchema.methods.generateCardNumber = function(){

    let bankCardNumber = '8';

    for (let i = 1; i < 15; i++) {
      bankCardNumber += Math.floor(Math.random() * 10).toString();
    }

    return bankCardNumber;
}

accountSchema.methods.generatePin = function(){

  let pin = '';

  for (let i = 1; i < 4; i++) {
    pin += Math.floor(Math.random() * 10).toString();
  }

  return pin;
}

accountSchema.methods.generateATM = async function (){
  const cardNumber = this.generateCardNumber();
  const pin = this.generatePin();

  const salt = await bcrypt.genSalt();
  const hashedPin = await bcrypt.hash(pin, salt);

  const card = {
    cardNumber:cardNumber,
    pin:pin,
  };

  this.cards.push({cardNumber,pin:hashedPin})

  return card;
};

accountSchema.methods.withdrawATM = async function(amountToWithdraw,cardNumber,pin){
  const card = this.cards.filter((card)=>card.cardNumber.toString() === cardNumber.toString());

  if(!(card.length > 0)) throw new Error("Invalid Card and/or Pin");

  const pinMatch = await bcrypt.compare(pin, card[0].pin);

  if (this.balance < amountToWithdraw) {
    throw new Error("Amount to withdraw is more than running balance");
  }

  if(pinMatch){
    this.balance -= amountToWithdraw;
    const transactionDate  = Date.now()
    this.transactions.push({
      date:transactionDate,
      description: `ATM Withdraw with amount ${amountToWithdraw} on date ${new Date(transactionDate).toString()}`,
      amount: amountToWithdraw,
      transactionType:"Withdraw",
    });
  }

  else throw new Error("Invalid Card and/or Pin");
}

accountSchema.methods.withdraw = function (amountToWithdraw,routingNumber,accountNumber) {
  if (this.balance < amountToWithdraw) {
    throw new Error("Amount to withdraw is more than running balance");
  } else {
    this.balance -= amountToWithdraw;
    const transactionDate  = Date.now()
    this.transactions.push({
      date:transactionDate,
      description: `Withdraw ${amountToWithdraw} to Account ${accountNumber} on date ${new Date(transactionDate).toString()}`,
      amount: amountToWithdraw,
      transactionType:"Withdraw",
      accountNumber:accountNumber,
      routingNumber:routingNumber,
    });
  }
};

accountSchema.methods.deposit = function (amountToDeposit,routingNumber,accountNumber) {
  this.balance += parseInt(amountToDeposit);
  const transactionDate  = Date.now()
  this.transactions.push({
    date:transactionDate,
    description: `Deposit ${amountToDeposit} from Account ${accountNumber} on date ${new Date(transactionDate).toString()}`,
    amount: amountToDeposit,
    transactionType:"Deposit",
    accountNumber:accountNumber,
    routingNumber:routingNumber,
  });
};

accountSchema.methods.transfer = async function (amountToTransfer, receiverAccount) {
  if (this.balance < amountToTransfer) {
    throw new Error("Amount to withdraw is more than running balance");
  } else {
    this.balance -= amountToTransfer;
    receiverAccount.balance += parseInt(amountToTransfer);
    this.transactions.push({
      description: `Transfer to ${receiverAccount.id} amount ${amountToTransfer}`,
      amount: amountToTransfer,
    });
    receiverAccount.transactions.push({
      description: `Transfer from ${this.id} amount ${amountToTransfer}`,
      amount: amountToTransfer,
    });

    await receiverAccount.save();
  }
};

const Account = mongoose.model("account", accountSchema);

module.exports = Account;


// 9 digit routing number
// Acccout Number 8 to 12
