const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");

// Function to hash a message
function hashMessage(message) {
  return keccak256(utf8ToBytes(message));
}

// Get the Ethereum address (Remove the first element, hash the rest of the public key
// and then take the last 20 bytes of the hash)
const getAddress = (publicKey) => {
  let firstRemoved = publicKey.slice(1, publicKey.length);
  let hash = keccak256(firstRemoved);
  let pos = hash.length - 20;
  return hash.slice(pos, hash.length);
};

// Function to get the Ethereum address string
const getAddressString = (publicKey) => {
  const address = getAddress(publicKey);
  return "0x" + toHex(address);
};

// Function to recover the public key
const recoverKey = (message, signature, recoveryBit) => {
  const messageHash = hashMessage(message);
  const recovered = secp.recoverPublicKey(messageHash, signature, recoveryBit);
  return recovered;
};

module.exports = { getAddressString, recoverKey };
