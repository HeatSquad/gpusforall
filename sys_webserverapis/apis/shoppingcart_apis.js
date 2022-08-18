const mySqlConnection = require('../../shared_server/wrappers_mysql.js');
const gpusGeneral = require('../../shared_server/general.js');

const apiArray = []
module.exports = apiArray;

async function replyto_jsonAddToCart(req, res)
{
    if (req.body.productid === undefined) return gpusGeneral.buildJsonErrorMessage(`Missing required parameter:`);
    if (req.body.userid === undefined) return gpusGeneral.buildJsonErrorMessage(`Missing required parameter:`);
    if (req.body.quantity === undefined) return gpusGeneral.buildJsonErrorMessage(`Missing required parameter:`);
    if (req.body.created_by === undefined) return gpusGeneral.buildJsonErrorMessage(`Missing required parameter:`);
    if (req.body.modified_by === undefined) return gpusGeneral.buildJsonErrorMessage(`Missing required parameter:`);

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
    if (jsonGetSysDataOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Error message:`, req, res);

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
    if (req.body.shoppingcartid === undefined) return gpusGeneral.buildJsonErrorMessage(`Error message:`, req, res);

    const arrayBindParams = [];
    arrayBindParams.push(req.body.shoppingcartid);

    const sqlInsertIntoshoppingcart =
        `UPDATE shopping_cart set deleted = 'Y' WHERE shoppingcartid = ?`;
    const jsonSetDataPromise = mySqlConnection.execMySql(sqlInsertIntoshoppingcart, arrayBindParams);
    const jsonSetDataOutput = await jsonSetDataPromise;
    if (jsonSetDataOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Error message:`, req, res);

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
    //if (req.session.userid === undefined) return gpusGeneral.buildJsonErrorMessage(`Error: Missing parameter userid `, req, res);

    const userid = req.params.userid;
    const arrayBindParams = [];
    arrayBindParams.push(userid);

    const sqlGetShoppingCart =
		`SELECT	*
          FROM	shopping_cart
    	  WHERE userid = ?
            `;
    const jsonSetDataPromise = mySqlConnection.execMySql(sqlGetShoppingCart,arrayBindParams);
    const jsonSetDataOutput = await jsonSetDataPromise;
    console.log(jsonSetDataPromise);
    if (jsonSetDataOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Error:Was not able to get shopping cart for ${userid}`, req, res);

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