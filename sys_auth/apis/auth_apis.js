const mySqlConnection = require('../../shared_server/wrappers_mysql.js');
const gpusGeneral = require('../../shared_server/general.js');

const apiArray = [];
module.exports = apiArray;

async function replyto_jsonTest(req, res)
{
    const jsonResult = {};
    jsonResult['status'] = 'SUCCESS';
    jsonResult['message'] = '';
    jsonResult['resultset'] = [];
    return jsonResult
}
apiArray.push(
    {
        method: 'POST',
        handler: replyto_jsonTest,
        path: 'jsonTest',
        options:
        {
            public: true,
            description: 'Test',
            group: 'Authorization',
            sampleParams: {}
        }
    }
);