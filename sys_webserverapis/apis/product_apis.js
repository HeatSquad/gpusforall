const mySqlConnection = require('../../shared_server/wrappers_mysql.js');
const gpusGeneral = require('../../shared_server/general.js');

const apiArray = []
module.exports = apiArray;

async function replyto_jsonGetAllProducts(req, res)
{
    const arrayBindParams = [];
    const sqlSelectAllProducts =
        `SELECT * 
          FROM products
          WHERE deleted <> 'N'`;
    const jsonGetSysDataPromise = mySqlConnection.execMySql(sqlSelectAllProducts, arrayBindParams);
    const jsonGetSysDataOutput = await jsonGetSysDataPromise;
    if (jsonGetSysDataOutput['status'] != 'SUCCESS') return gpusGeneral.replywith_jsonErrorMessage(`Error message: Failed to retrieve all products`, req, res);

    return jsonGetSysDataOutput;
}

apiArray.push(
    {
        method: 'GET',
        handler: replyto_jsonGetAllProducts,
        path: 'jsonAddTojsonGetAllProductsCart',
        options:
        {
            public: true,
            description: 'Gets all products',
            group: 'products'
        }
    }
);