// To execute script:
// node crypto_generate_key.js 32
const crypto = require('crypto');

(function generateKey()
{
    if (process.argv.length != 3)
    {
        console.error(`ERROR! Invalid # of arguments`);
        return;
    }

    const numberBytes = parseInt(process.argv[2]);
    const buf = crypto.randomBytes(numberBytes);
    console.log(buf.toString('hex'));
})();