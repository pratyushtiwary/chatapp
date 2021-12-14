const sha256 = require("crypto-js/sha256");
const aes = require("crypto-js/aes");
const cryptojs = require("crypto-js");

const SALT = "3jw02i2qms";

function hash_password(password) {
    return sha256(password.toString()).toString();
}

function verify_password(password, hash) {
    return hash_password(password) === hash;
}

function encrypt(text,salt=SALT){
    return aes.encrypt(text,salt).toString();
}

function decrypt(encryptedTxt,salt=SALT){
    const bytes = aes.decrypt(encryptedTxt,salt);
    return bytes.toString(cryptojs.enc.Utf8);
}

module.exports = {
    hash_password,
    verify_password,
    encrypt,
    decrypt
}