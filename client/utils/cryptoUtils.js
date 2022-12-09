import * as secp from "ethereum-cryptography/secp256k1.js";
import { utf8ToBytes } from "ethereum-cryptography/utils.js";
import { keccak256 } from "ethereum-cryptography/keccak.js";
import { wallets } from "../utils/wallets";

// Function to hash a message
function hashMessage(message) {
  return keccak256(utf8ToBytes(message));
}


// Function to sign a message. The address is used here to get its private key 
// from the generated wallets to sign the message.
export async function signMessage(msg, address) {
  const privateKey = wallets[address].privateKey;
  const msgHash = hashMessage(msg);
  const signatureE = await secp.sign(msgHash, privateKey, {
    extraEntropy: true,
    recovered: true,
  });
  return signatureE;
}
