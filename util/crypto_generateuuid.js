const crypto = require('crypto');

(function generateUUID()
{
    if (process.argv.length != 2)
    {
        console.error(`ERROR! Invalid # of arguments`);
        return;
    }
    return crypto.randomUUID();
})();