const sha256 = require("crypto-js/sha256");
const aes = require("crypto-js/aes");
const cryptojs = require("crypto-js");

const SALT = "5943u2w9843";

function hash_password(password) {
  return sha256(password.toString()).toString();
}

function verify_password(password, hash) {
  return hash_password(password) === hash;
}

function encrypt(text, salt = SALT) {
  return aes.encrypt(text, salt).toString();
}

function decrypt(encryptedTxt, salt = SALT) {
  try {
    const bytes = aes.decrypt(encryptedTxt, salt);
    return bytes.toString(cryptojs.enc.Utf8);
  } catch (err) {
    console.log(err);
    return false;
  }
}

function verify_token(token, salt = SALT) {
  if (token) {
    return decrypt(token, salt) !== "";
  } else {
    return false;
  }
}

export { hash_password, verify_password, encrypt, decrypt, verify_token };
