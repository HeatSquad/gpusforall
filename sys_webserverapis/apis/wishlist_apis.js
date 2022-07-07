const mySqlConnection = require('../../shared_server/wrappers_mysql.js');
const gpusGeneral = require('../../shared_server/general.js');

const apiArray = []
module.exports = apiArray;

async function replyto_jsonAddToWishlist(req, res)
{
    if (req.body.productid === undefined) return gpusGeneral.replywith_jsonInvalidParameters(`Missing required parameter: productid`);
    if (req.body.userid === undefined) return gpusGeneral.replywith_jsonInvalidParameters(`Missing required parameter: userid`);
    if (req.body.quantity === undefined) return gpusGeneral.replywith_jsonInvalidParameters(`Missing required parameter:quantity`);
    if (req.body.created_by === undefined) return gpusGeneral.replywith_jsonInvalidParameters(`Missing required parameter: created_by`);
    if (req.body.modified_by === undefined) return gpusGeneral.replywith_jsonInvalidParameters(`Missing required parameter: modified_by`);

    const arrayBindParams = [];
    arrayBindParams.push(req.body.productid);
    arrayBindParams.push(req.body.userid);
    arrayBindParams.push(req.body.quantity);
    arrayBindParams.push(req.body.created_by);
    arrayBindParams.push(req.body.modified_by);
    arrayBindParams.push('N');

    const sqlInsertIntoWishlist =
        `INSERT INTO wish_list (productid, userid, quantity, created_by, modified_by, deleted)
            VALUES(?, ?, ?, ?, ?, ?)`;
    const jsonGetSysDataPromise = mySqlConnection.execMySql(sqlInsertIntoWishlist, arrayBindParams);
    const jsonGetSysDataOutput = await jsonGetSysDataPromise;
    console.log(jsonGetSysDataOutput);
    if (jsonGetSysDataOutput['status'] != 'SUCCESS') return gpusGeneral.replywith_jsonErrorMessage(`Error message: did not item to wishlist`, req, res);

    return jsonGetSysDataOutput;
}

apiArray.push(
    {
        method: 'POST',
        handler: replyto_jsonAddToWishlist,
        path: 'jsonAddToWishlist',
        options:
        {
            public: true,
            description: 'Add a product to wishlist',
            group: 'Wishlist'
        }
    }
);

async function replyto_jsonRemoveFromWishlist(req, res)
{
    if (req.body.wishlistid === undefined) return gpusGeneral.replywith_jsonInvalidParameters(`Error message:`, req, res);

    const arrayBindParams = [];
    arrayBindParams.push(req.body.wishlistid);

    const sqlInsertIntoWishlist =
        `UPDATE wish_list SET deleted = 'Y' WHERE wishlistid = ?`;
    const jsonSetDataPromise = mySqlConnection.execMySql(sqlInsertIntoWishlist, arrayBindParams);
    const jsonSetDataOutput = await jsonSetDataPromise;
    if (jsonSetDataOutput['status'] != 'SUCCESS') return gpusGeneral.replywith_jsonErrorMessage(`Error message:`, req, res);

    return jsonSetDataOutput;
}

apiArray.push(
    {
        method: 'POST',
        handler: replyto_jsonRemoveFromWishlist,
        path: 'jsonRemoveFromWishlist',
        options:
        {
            public: true,
            description: 'Remove a product from users wishlist',
            group: 'Wishlist'
        }
    }
);

async function replyto_jsonGetWishList(req, res)
{
    if (req.params.userid === undefined) return gpusGeneral.replywith_jsonInvalidParameters(`Error message: Missing parameter userid `, req, res);

    const userid = req.params.userid;
    const arrayBindParams = [];
    arrayBindParams.push(userid);

    const sqlInsertIntoWishlist =
		`SELECT	*
          FROM	wish_list
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
        handler: replyto_jsonGetWishList,
        path: 'jsonGetWishList/:userid',
        options:
        {
            public: true,
            description: 'Retrieves a specific users wishlist',
            group: 'Wishlist'
        }
    }
);