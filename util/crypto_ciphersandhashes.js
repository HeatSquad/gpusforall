const crypto = require('crypto');
const fs = require('fs');

const supportedHashes = crypto.getHashes();
const supportedCiphers = crypto.getCiphers();
fs.writeFile('supported_hashes.txt', supportedHashes.join('\n'), function (err) {
  if (err) throw err;
  console.log('Hashes Saved!');
});

fs.writeFile('supported_ciphers.txt', supportedCiphers.join('\n'), function (err) {
    if (err) throw err;
    console.log('Ciphers Saved!');
});