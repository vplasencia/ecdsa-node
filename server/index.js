const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const {
  getAddressString,
  recoverKey,
} = require("./utils/cryptoUtils.js");

const balances = {
  "0x45365d06034aa6af1aa0ebeae8746fc4a80c3977": 100,
  "0xc0e7bf36d8cbe2d9c938244c127b64ecbea78e00": 50,
  "0xfe3023cdc78dead7724adfb7fc5e6bea6da47e54": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { signature, recoveryBit, amount, recipient } = req.body;

  // Recover the public key of the wallet that signed the signature
  const recovered = recoverKey("Transaction", signature, recoveryBit);

  // Get the Ethereum address string
  const sender = getAddressString(recovered);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
