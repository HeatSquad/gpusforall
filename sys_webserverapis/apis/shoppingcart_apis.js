const mySqlConnection = require('../../shared_server/wrappers_mysql.js');
const gpusGeneral = require('../../shared_server/general.js');

const apiArray = []
module.exports = apiArray;

async function replyto_jsonUpdateCart(req, res)
{
    if (req.body.userid === undefined) return gpusGeneral.replywith_jsonInvalidParameters(`Missing required parameter:`);
    if (req.body.cart_items === undefined) return gpusGeneral.replywith_jsonInvalidParameters(`Missing required parameter:`);
    if (req.body.modified_by === undefined) return gpusGeneral.replywith_jsonInvalidParameters(`Missing required parameter:`);

    let sqlInsertIntoshoppingcart =
        `INSERT INTO shopping_cart (cart_items, userid, created_by, modified_by)
            VALUES(?, ?, ?, ?)`;

    const arrayBindParams = [];

    if(req.body.cartid)
    {
        sqlInsertIntoshoppingcart =
        `UPDATE shopping_cart
         SET cart_items = ?, modified_by = ?
         WHERE cartid = ?
           AND userid = ?
           AND deleted <> 'Y'`;
        
        arrayBindParams.push(req.body.cart_items);
        arrayBindParams.push(req.body.modified_by);
        arrayBindParams.push(req.body.cartid);
        arrayBindParams.push(req.body.userid);
    }
    else
    {
        arrayBindParams.push(req.body.cart_items);
        arrayBindParams.push(req.body.userid);
        arrayBindParams.push(req.body.created_by);
        arrayBindParams.push(req.body.modified_by);
    }

    const jsonGetSysDataPromise = mySqlConnection.execMySql(sqlInsertIntoshoppingcart, arrayBindParams);
    const jsonGetSysDataOutput = await jsonGetSysDataPromise;
    if (jsonGetSysDataOutput['status'] != 'SUCCESS') return gpusGeneral.replywith_jsonErrorMessage(`Error message:`, req, res);

    return jsonGetSysDataOutput;
}

apiArray.push(
    {
        method: 'PUT',
        handler: replyto_jsonUpdateCart,
        path: 'jsonUpdateCart',
        options:
        {
            public: true,
            description: 'Update the Shopping Cart',
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