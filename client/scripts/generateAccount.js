import secp from "ethereum-cryptography/secp256k1.js";
import { toHex } from "ethereum-cryptography/utils.js";
import { keccak256 } from "ethereum-cryptography/keccak.js";

// Default number of wallets
const walletCount = 3;

// Function to get the Ethereum address
const getAddress = (publicKey) => {
  let firstRemoved = publicKey.slice(1, publicKey.length);
  let hash = keccak256(firstRemoved);
  let pos = hash.length - 20;
  return hash.slice(pos, hash.length);
};

// Function to generate wallets
const generateWallet = (count = walletCount) => {
  let privateKey;
  let publicKey;
  let address;
  for (let i = 0; i < count; i++) {
    privateKey = secp.utils.randomPrivateKey();
    publicKey = secp.getPublicKey(privateKey);
    address = getAddress(publicKey);
    console.log("Private Key" + " " + i + "->", toHex(privateKey));
    console.log("Public Key" + " " + i + "->", toHex(publicKey));
    console.log("Address" + " " + i + "->", "0x" + toHex(address));
  }
};

generateWallet();
