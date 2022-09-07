const mySqlConnection = require('../../shared_server/wrappers_mysql.js');
const gpusGeneral = require('../../shared_server/general.js');

const apiArray = []
module.exports = apiArray;

// async function replyto_jsonGetAllProducts(req, res)
// {
//     const arrayBindParams = [];
//     const sqlSelectAllProducts =
//         `SELECT * 
//           FROM sys.products
//           WHERE deleted <> 'Y'`;
//     const jsonGetSysDataPromise = mySqlConnection.execMySql(sqlSelectAllProducts, arrayBindParams);
//     const jsonGetSysDataOutput = await jsonGetSysDataPromise;
//     if (jsonGetSysDataOutput['status'] != 'SUCCESS') return gpusGeneral.replywith_jsonErrorMessage(`Error message: Failed to retrieve all products`, req, res);

//     return jsonGetSysDataOutput;
// }

// apiArray.push(
//     {
//         method: 'GET',
//         handler: replyto_jsonGetAllProducts,
//         path: 'jsonGetAllProducts',
//         options:
//         {
//             public: true,
//             description: 'Gets all products',
//             group: 'products'
//         }
//     }
// );

async function replyto_jsonSearchProduct(req, res)
{
    if (req.params.product_name === undefined) req.params.product_name = '';

    const arrayBindParams = [];
    arrayBindParams.push(req.params.product_name);

    const sqlSelectAllProducts =
        `SELECT * 
          FROM products
          WHERE deleted <> 'Y'
          AND   product_name LIKE CONCAT(?, '%')`;
    const jsonGetSysDataPromise = mySqlConnection.execMySql(sqlSelectAllProducts, arrayBindParams);
    const jsonGetSysDataOutput = await jsonGetSysDataPromise;
    if (jsonGetSysDataOutput['status'] != 'SUCCESS') return gpusGeneral.replywith_jsonErrorMessage(`Error message: Failed to search products`, req, res);

    return jsonGetSysDataOutput;
}

apiArray.push(
    {
        method: 'GET',
        handler: replyto_jsonSearchProduct,
        path: 'jsonSearchProduct/:product_name',
        options:
        {
            public: true,
            description: 'Looks for product based on input',
            group: 'products'
        }
    }
);