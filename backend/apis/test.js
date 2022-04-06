const mySqlConnection = require('../shared/mysql.js');

const apiArray = []
module.exports = apiArray;

async function replyto_jsonSomeTypeOfFunction(req, res)
{
    const arrayBindParams = [];
    const sqlStmtGetSysData = `SELECT * FROM sys.sys_config`;
    const jsonGetSysDataPromise = mySqlConnection.execMySql(sqlStmtGetSysData, arrayBindParams);
    const jsonGetSysDataOutput = await jsonGetSysDataPromise;
    if (jsonGetSysDataOutput['status'] != 'SUCCESS')
    {
        console.log(jsonGetSysDataOutput);
    }
    console.log(jsonGetSysDataOutput);

    res.send('werid text here harlan likes hot dogs like a lot of them in his mouth at once');
}

apiArray.push(
    {
        method: 'GET',
        handler: replyto_jsonSomeTypeOfFunction,
        path: 'jsonSomeTypeOfFunction',
        options:
        {
            public: true,
            description: 'does something',
            group: 'random test api function'
        }
    }
);