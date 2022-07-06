const crypto = require('crypto');

(function checkHash()
{
    if (process.argv.length != 4)
    {
        console.error(`ERROR! Invalid # of arguments`);
        return;
    }
    
    const password = process.argv[2];
    const salt = process.argv[3];
    const saltedMessage = '' + password + salt;
    const hash = crypto.createHash('sha256').update(saltedMessage).digest('hex');
    console.log(process.argv);
    console.log('Password: ', password);
    console.log('Salt: ', salt);
    console.log('Hash: ', hash);
})();