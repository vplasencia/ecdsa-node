import { useState } from "react";
import server from "./server";

import { signMessage } from "../utils/cryptoUtils";

import { toHex } from "ethereum-cryptography/utils";

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    // Sign the message
    const signResponse = await signMessage("Transaction", address);
    // Get the signature and recoveryBit
    const [signature, recoveryBit] = signResponse;

    // Call the api to execute the transaction 
    // The signature must be converted to Hexadecimal
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        signature: toHex(signature),
        recoveryBit,
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);
      alert("Successfully transferred");
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
