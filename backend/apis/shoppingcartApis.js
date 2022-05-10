const mySqlConnection = require('../../shared/wrappers_mysql.js');
const gpusGeneral = require('../../shared/general.js');

const apiArray = []
module.exports = apiArray;

async function replyto_jsonAddToCart(req, res)
{
    if (req.body.productid === undefined) return gpusGeneral.replywith_jsonInvalidParameters(`Missing required parameter:`);
    if (req.body.userid === undefined) return gpusGeneral.replywith_jsonInvalidParameters(`Missing required parameter:`);
    if (req.body.quantity === undefined) return gpusGeneral.replywith_jsonInvalidParameters(`Missing required parameter:`);
    if (req.body.created_by === undefined) return gpusGeneral.replywith_jsonInvalidParameters(`Missing required parameter:`);
    if (req.body.modified_by === undefined) return gpusGeneral.replywith_jsonInvalidParameters(`Missing required parameter:`);

    const arrayBindParams = [];
    arrayBindParams.push(req.body.productid);
    arrayBindParams.push(req.body.userid);
    arrayBindParams.push(req.body.quantity);
    arrayBindParams.push(req.body.created_by);
    arrayBindParams.push(req.body.modified_by);
    arrayBindParams.push('N');

    const sqlInsertIntoshoppingcart =
        `INSERT INTO shopping_cart 
            VALUES(?, ?, ?, ?, ?, ?)`;
    const jsonGetSysDataPromise = mySqlConnection.execMySql(sqlInsertIntoshoppingcart, arrayBindParams);
    const jsonGetSysDataOutput = await jsonGetSysDataPromise;
    if (jsonGetSysDataOutput['status'] != 'SUCCESS') return gpusGeneral.replywith_jsonErrorMessage(`Error message:`, req, res);

    return jsonGetSysDataOutput;
}

apiArray.push(
    {
        method: 'POST',
        handler: replyto_jsonAddToCart,
        path: 'jsonAddToCart',
        options:
        {
            public: true,
            description: 'Add a product to ShoppingCart',
            group: 'shoppingcart'
        }
    }
);

async function replyto_jsonRemoveFromShoppingCart(req, res)
{
    if (req.body.shoppingcartid === undefined) return gpusGeneral.replywith_jsonInvalidParameters(`Error message:`, req, res);

    const arrayBindParams = [];
    arrayBindParams.push(req.body.shoppingcartid);

    const sqlInsertIntoshoppingcart =
        `UPDATE shopping_cart set deleted = 'Y' WHERE shoppingcartid = ?`;
    const jsonSetDataPromise = mySqlConnection.execMySql(sqlInsertIntoshoppingcart, arrayBindParams);
    const jsonSetDataOutput = await jsonSetDataPromise;
    if (jsonSetDataOutput['status'] != 'SUCCESS') return gpusGeneral.replywith_jsonErrorMessage(`Error message:`, req, res);

    return jsonSetDataOutput;
}

apiArray.push(
    {
        method: 'POST',
        handler: replyto_jsonRemoveFromShoppingCart,
        path: 'jsonRemoveFromShoppingCart',
        options:
        {
            public: true,
            description: 'Remove a product from users shoppingcart',
            group: 'shoppingcart'
        }
    }
);

async function replyto_jsonGetShoppingCart(req, res)
{
    if (req.params.userid === undefined) return gpusGeneral.replywith_jsonInvalidParameters(`Error message: Missing parameter userid `, req, res);

    const userid = req.body.userid;
    const arrayBindParams = [];
    arrayBindParams.push(userid);

    const sqlInsertIntoWishlist =
		`SELECT	*
          FROM	shopping_cart
    	  WHERE userid = ?
            `;
    const jsonSetDataPromise = mySqlConnection.execMySql(sqlInsertIntoWishlist, arrayBindParams);
    const jsonSetDataOutput = await jsonSetDataPromise;
    if (jsonSetDataOutput['status'] != 'SUCCESS') return gpusGeneral.replywith_jsonErrorMessage(`Error message:`, req, res);

    return jsonSetDataOutput;
}

apiArray.push(
    {
        method: 'GET',
        handler: replyto_jsonGetShoppingCart,
        path: 'jsonGetShoppingCart/:userid',
        options:
        {
            public: true,
            description: 'Retrieves a specific users shopping cart',
            group: 'Wishlist'
        }
    }
);