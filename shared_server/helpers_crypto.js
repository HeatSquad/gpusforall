const crypto = require('crypto');

function cryptoGenerateUUID()
{
    const randomUUID = crypto.randomUUID();
    return randomUUID;
}

function cryptoRandomBytes(byteLength)
{
    const jsonResult = {};
    jsonResult['status'] = 'ERROR';
    jsonResult['message'] = '';
    jsonResult['resultset'] = [];

    return new Promise((resolve, reject) => {
        crypto.randomBytes(byteLength, (err, buf) => {
            if (err)
            {
                jsonResult['message'] = 'Failed to generate salt';
                reject(jsonResult);
            }
            jsonResult['status'] = 'SUCCESS';
            jsonResult['message'] = 'Salt was generated';
            jsonResult['resultset'].push({buf: buf})
            resolve(jsonResult);
        })
    });
}

function cryptoHashMessage256Bit(message, salt)
{
    console.log(`Buffer.byteLength(): ${Buffer.byteLength(salt, 'hex')}`);
    if (Buffer.byteLength(salt, 'hex') != 32) return null;
    const saltedMessage = '' + message + salt;
    const hash = crypto.createHash('sha256').update(saltedMessage).digest('hex');
    return hash;
}

// NOTE: When stored, iv is hex, when decrypted, iv should be buffer
// message: Buffer
// iv: Buffer
function cryptoEncryptCardInfoAES(message, iv)
{
    if (message === undefined || message == null) return null;
    if (iv === undefined || iv == null) return null;
    if (process.env.ENCRYPTION_KEY_CARD_INFO === undefined) return null;
    if (typeof message != 'string') return null;

    // console.log(message);
    // console.log(iv);
    // Make sure that both secret and iv are buffers
    const encryptionKeyCardInfoBuffer = Buffer.from(process.env.ENCRYPTION_KEY_CARD_INFO, 'hex');
    const ivBuffer = Buffer.from(iv, 'hex');
    const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKeyCardInfoBuffer, ivBuffer);
    let encrypted = cipher.update(message, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// NOTE: When stored, iv is hex, when decrypted, iv should be buffer
function cryptoDecryptCardInfoAES(encryptedMessage, iv)
{
    if (encryptedMessage === undefined || encryptedMessage == null) return null;
    if (iv === undefined || iv == null) return null;
    if (process.env.ENCRYPTION_KEY_CARD_INFO === undefined) return null;
    if (typeof encryptedMessage != 'string') return null;

    // console.log(encryptedMessage);
    // console.log(iv);
    // Make sure that both secret and iv are buffers
    const encryptionKeyCardInfoBuffer = Buffer.from(process.env.ENCRYPTION_KEY_CARD_INFO, 'hex');
    const ivBuffer = Buffer.from(iv, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKeyCardInfoBuffer, ivBuffer);
    let decrypted = decipher.update(encryptedMessage, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}

module.exports =
{
    cryptoGenerateUUID: cryptoGenerateUUID,
    cryptoRandomBytes: cryptoRandomBytes,
    cryptoHashMessage256Bit: cryptoHashMessage256Bit,
    cryptoEncryptCardInfoAES: cryptoEncryptCardInfoAES,
    cryptoDecryptCardInfoAES: cryptoDecryptCardInfoAES,
};