const mySqlConnection = require('../../shared_server/wrappers_mysql.js');
const gpusGeneral = require('../../shared_server/general.js');

const apiArray = []
module.exports = apiArray;

async function replyto_jsonFetchReviewsByProductID(req, res)
{
    const arrayBindParams = [];
    arrayBindParams.push(req.params.productid);
    const sqlStmtFetchReviews = `
        SELECT
            r.reviewid, 
            r.productid,
            r.userid,
            r.title,
            r.text,
            r.created AS review_created,
            r.created_by AS review_created_by,
            r.modified AS review_modified,
            r.modified_by AS review_modified_by,

            ri.imageid,
            ri.image,
            ri.created AS image_created,
            ri.created_by AS image_created_by,
            ri.modified AS image_modified,
            ri.modified_by AS image_modified_by,
            u.first_name,
            u.last_name
        FROM reviews r
            LEFT JOIN review_images ri ON ri.reviewid = r.reviewid
            LEFT JOIN users u ON u.userid = r.userid
        WHERE
            r.deleted <> 'Y'
            AND (ri.deleted <> 'Y' OR ri.deleted IS NULL)
            AND r.productid = ?
            AND u.deleted <> 'Y'
    `;
    const jsonFetchReviewsPromise = mySqlConnection.execMySql(sqlStmtFetchReviews, arrayBindParams);
    const jsonFetchReviewsOutput = await jsonFetchReviewsPromise;
    if (jsonFetchReviewsOutput['status'] != 'SUCCESS')
    {
        console.log(jsonFetchReviewsOutput);
        return gpusGeneral.buildJsonErrorMessage(`Failed to fetch product with id: ${req.params.productid}`, req, res)
    }
    console.log(jsonFetchReviewsOutput);
    return jsonFetchReviewsOutput;
}

apiArray.push(
    {
        method: 'GET',
        handler: replyto_jsonFetchReviewsByProductID,
        path: 'jsonFetchReviewsByProductID/:productid',
        options:
        {
            public: true,
            description: 'fetches the product reviews and images if available based off product id',
            group: 'reviews'
        }
    }
);

async function replyto_jsonFetchReviewsByUserID(req, res)
{
    const arrayBindParams = [];
    arrayBindParams.push(req.params.userid);
    const sqlStmtFetchReviews = `
        SELECT
            r.reviewid, 
            r.productid,
            r.userid,
            r.title,
            r.text,
            r.created AS review_created,
            r.created_by AS review_created_by,
            r.modified AS review_modified,
            r.modified_by AS review_modified_by,

            ri.imageid,
            ri.image,
            ri.created AS image_created,
            ri.created_by AS image_created_by,
            ri.modified AS image_modified,
            ri.modified_by AS image_modified_by,

            u.first_name,
            u.last_name
        FROM reviews r
            LEFT JOIN review_images ri ON ri.reviewid = r.reviewid
            LEFT JOIN users u ON u.userid = r.userid
        WHERE
            r.deleted <> 'Y'
            AND (ri.deleted <> 'Y' OR ri.deleted IS NULL)
            AND r.userid = ?
            AND u.deleted <> 'Y'
    `;
    const jsonFetchReviewsPromise = mySqlConnection.execMySql(sqlStmtFetchReviews, arrayBindParams);
    const jsonFetchReviewsOutput = await jsonFetchReviewsPromise;
    if (jsonFetchReviewsOutput['status'] != 'SUCCESS')
    {
        console.log(jsonFetchReviewsOutput);
        return gpusGeneral.buildJsonErrorMessage(`Failed to fetch user with id: ${req.params.userid}`, req, res)
    }
    console.log(jsonFetchReviewsOutput);
    return jsonFetchReviewsOutput;
}

apiArray.push(
    {
        method: 'GET',
        handler: replyto_jsonFetchReviewsByUserID,
        path: 'jsonFetchReviewsByUserID/:userid',
        options:
        {
            public: true,
            description: 'fetches the product reviews and images for the user id',
            group: 'reviews'
        }
    }
);

async function replyto_jsonFetchReviewsByUserAndProduct(req, res)
{
    if (req.params.productid === undefined) return gpusGeneral.buildJsonInvalidParameters('Missing required parameter: productid', req, res);
    if (req.params.userid === undefined) return gpusGeneral.buildJsonInvalidParameters('Missing required parameter: userid', req, res);
    
    const arrayBindParams = [];
    arrayBindParams.push(req.params.productid);
    arrayBindParams.push(req.params.userid);

    const sqlStmtFetchReviews = `
        SELECT
            r.reviewid, 
            r.productid,
            r.userid,
            r.title,
            r.text,
            r.created AS review_created,
            r.created_by AS review_created_by,
            r.modified AS review_modified,
            r.modified_by AS review_modified_by,

            ri.imageid,
            ri.image,
            ri.created AS image_created,
            ri.created_by AS image_created_by,
            ri.modified AS image_modified,
            ri.modified_by AS image_modified_by,
            u.first_name,
            u.last_name
        FROM reviews r
            LEFT JOIN review_images ri ON ri.reviewid = r.reviewid
            LEFT JOIN users u ON u.userid = r.userid
        WHERE
            r.deleted <> 'Y'
            AND (ri.deleted <> 'Y' OR ri.deleted IS NULL)
            AND r.productid = ?
            AND u.userid = ?
            AND u.deleted <> 'Y'
    `;
    const jsonFetchReviewsPromise = mySqlConnection.execMySql(sqlStmtFetchReviews, arrayBindParams);
    const jsonFetchReviewsOutput = await jsonFetchReviewsPromise;
    if (jsonFetchReviewsOutput['status'] != 'SUCCESS')
    {
        console.log(jsonFetchReviewsOutput);
        return gpusGeneral.buildJsonErrorMessage(`Failed to fetch review for product with id: ${req.body.productid} and userid: ${req.body.userid}`, req, res)
    }
    console.log(jsonFetchReviewsOutput);
    return jsonFetchReviewsOutput;
}

apiArray.push(
    {
        method: 'GET',
        handler: replyto_jsonFetchReviewsByUserAndProduct,
        path: 'jsonFetchReviewsByUserAndProduct/:productid/:userid',
        options:
        {
            public: true,
            description: 'fetches the product reviews and images if available based off product id and user id',
            group: 'reviews'
        }
    }
);

async function replyto_jsonDeleteReviews(req, res)
{
    if (req.body.productid === undefined) return gpusGeneral.buildJsonInvalidParameters('Missing required parameter: productid', req, res);
    if (req.body.userid === undefined) return gpusGeneral.buildJsonInvalidParameters('Missing required parameter: userid', req, res);

    const arrayBindParams = [];
    arrayBindParams.push(req.body.userid);
    arrayBindParams.push(req.body.productid);
    const sqlStmtDeleteReviews = `
        UPDATE reviews
        SET deleted = 'Y'
        WHERE
            deleted <> 'Y'
            AND userid = ?
            AND productid = ?
    `;
    const jsonDeleteReviewsPromise = mySqlConnection.execMySql(sqlStmtDeleteReviews, arrayBindParams);
    const jsonDeleteReviewsOutput = await jsonDeleteReviewsPromise;
    if (jsonDeleteReviewsOutput['status'] != 'SUCCESS')
    {
        console.log(jsonDeleteReviewsOutput);
        return gpusGeneral.buildJsonErrorMessage(`Failed to update review for product with id: ${req.params.productid}`, req, res)
    }
    console.log(jsonDeleteReviewsOutput);

    const sqlStmtDeleteReviewImgs = `
        UPDATE review_images ri JOIN reviews r ON r.reviewid = ri.reviewid
        SET ri.deleted = 'Y'
        WHERE
            ri.deleted <> 'Y'
            AND r.userid = ?
            AND r.productid = ?
    `;
    const jsonDeleteReviewImgsPromise = mySqlConnection.execMySql(sqlStmtDeleteReviewImgs, arrayBindParams);
    const jsonDeleteReviewsImgsOutput = await jsonDeleteReviewImgsPromise;
    if (jsonDeleteReviewsImgsOutput['status'] != 'SUCCESS')
    {
        console.log(jsonDeleteReviewsImgsOutput);
        return gpusGeneral.buildJsonErrorMessage(`Failed to update pictures for product with id: ${req.params.productid}`, req, res)
    }
    console.log(jsonDeleteReviewsImgsOutput);

    return jsonDeleteReviewImgsPromise;
}

apiArray.push(
    {
        method: 'PUT',
        handler: replyto_jsonDeleteReviews,
        path: 'jsonDeleteReviews',
        options:
        {
            public: true,
            description: 'deletes the review and images by productid',
            group: 'reviews'
        }
    }
);


async function replyto_jsonSubmitReviews(req, res)
{
    if (req.body.productid === undefined) return gpusGeneral.buildJsonInvalidParameters('Missing required parameter: productid', req, res);
    if (req.body.userid === undefined) return gpusGeneral.buildJsonInvalidParameters('Missing required parameter: userid', req, res);
    if (req.body.text === undefined) return gpusGeneral.buildJsonInvalidParameters('Missing required parameter: text', req, res);
    if (req.body.title === undefined) return gpusGeneral.buildJsonInvalidParameters('Missing required parameter: title', req, res);

    const arrayBindParams = [];
    arrayBindParams.push(req.body.productid);
    arrayBindParams.push(req.body.userid);
    arrayBindParams.push(req.body.title);
    arrayBindParams.push(req.body.text);
    arrayBindParams.push(req.body.userid);
    arrayBindParams.push(req.body.userid);

    const sqlStmtSubmitReviews = `
        INSERT INTO reviews (productid, userid, title, text, created_by, modified_by)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const jsonSubmitReviewsPromise = mySqlConnection.execMySql(sqlStmtSubmitReviews, arrayBindParams);
    const jsonSubmitReviewsOutput = await jsonSubmitReviewsPromise;
    if (jsonSubmitReviewsOutput['status'] != 'SUCCESS')
    {
        console.log(jsonSubmitReviewsOutput);
        return gpusGeneral.buildJsonErrorMessage(`Failed to insert review for product with id: ${req.params.productid}`, req, res)
    }
    console.log(jsonSubmitReviewsOutput);

    //loop through the array of images and insert each one, one by one 
    if (req.body.images)
    {
        const fetchIDParams = [];
        fetchIDParams.push(req.body.productid);
        fetchIDParams.push(req.body.userid);
        const sqlfetchIDStatement = `
            SELECT r.reviewid
            FROM reviews r
            WHERE r.productid = ?
            AND r.userid = ?
        `;
        const jsonFetchIDPromise = mySqlConnection.execMySql(sqlfetchIDStatement, fetchIDParams);
        const jsonFetchIDOutput = await jsonFetchIDPromise;
        if (jsonFetchIDOutput['status'] != 'SUCCESS')
        {
            console.log(jsonFetchIDOutput);
            return gpusGeneral.buildJsonErrorMessage(`Failed to get reviewid for product with id: ${req.params.productid} and user ${req.params.userid}`, req, res)
        }
        console.log(jsonFetchIDOutput);
        
        const reviewid = jsonFetchIDOutput.resultset[0].reviewid;

        imagesArray = req.body.images;
        for (let i  = 0; i < imagesArray.length; i++)
        {
            //save base64
            const sqlBindPrms = [];
            sqlBindPrms.push(reviewid);
            sqlBindPrms.push(imagesArray[i]);
            sqlBindPrms.push(req.body.userid);
            sqlBindPrms.push(req.body.userid);

            const sqlStmtInsertImg = `
                INSERT INTO review_images (reviewid, image, created_by, modified_by)
                VALUES (?, ?, ?, ?)
            `;

            const jsonSubmitImgPromise = mySqlConnection.execMySql(sqlStmtInsertImg, sqlBindPrms);
            const jsonSubmitImgOutput = await jsonSubmitImgPromise;
            if (jsonSubmitImgOutput['status'] != 'SUCCESS')
            {
                console.log(jsonSubmitImgOutput);
                return gpusGeneral.buildJsonErrorMessage(`Failed to insert images for product with id: ${req.params.productid}`, req, res)
            }
            console.log(jsonSubmitImgOutput);
        }
    }

    const returnObj = {};
    returnObj['status'] = 'SUCCESS';
    returnObj['message'] = 'Successfully submitted the review and images';
    returnObj['resultset'] = {};
    return returnObj;
}

apiArray.push(
    {
        method: 'POST',
        handler: replyto_jsonSubmitReviews,
        path: 'jsonSubmitReviews',
        options:
        {
            public: true,
            description: 'submits review and images by productid',
            group: 'reviews'
        }
    }
);


async function replyto_jsonEditReviews(req, res)
{
    if (req.body.reviewid === undefined) return gpusGeneral.buildJsonInvalidParameters('Missing required parameter: reviewid', req, res);
    if (req.body.productid === undefined) return gpusGeneral.buildJsonInvalidParameters('Missing required parameter: productid', req, res);
    if (req.body.userid === undefined) return gpusGeneral.buildJsonInvalidParameters('Missing required parameter: userid', req, res);
    if (req.body.text === undefined) return gpusGeneral.buildJsonInvalidParameters('Missing required parameter: text', req, res);

    const arrayBindParams = [];
    arrayBindParams.push(req.body.title);
    arrayBindParams.push(req.body.text);
    arrayBindParams.push(req.body.reviewid);
    arrayBindParams.push(req.body.productid);
    arrayBindParams.push(req.body.userid);

    const sqlStmtEditReviews = `
        UPDATE reviews
        SET title = ?,
            text = ?
        WHERE reviewid = ?
        AND productid = ?
        AND userid = ?
        AND deleted <> 'Y'
    `;
    const jsonEditReviewsPromise = mySqlConnection.execMySql(sqlStmtEditReviews, arrayBindParams);
    const jsonEditReviewsOutput = await jsonEditReviewsPromise;
    if (jsonEditReviewsOutput['status'] != 'SUCCESS')
    {
        console.log(jsonEditReviewsOutput);
        return gpusGeneral.buildJsonErrorMessage(`Failed to edit review for product with id: ${req.params.productid} and user ${req.params.userid}`, req, res)
    }
    console.log(jsonEditReviewsOutput);

    //loop through the array of images and insert each one, one by one 
    if (req.body.images)
    {
        imagesArray = req.body.images;
        for (let i  = 0; i < imagesArray.length; i++)
        {
            const sqlBindPrms = [];
            let sqlStmtImg = ``;

            if(imagesArray[i].imageid == NULL)
            {
                sqlBindPrms.push(req.body.reviewid);
                sqlBindPrms.push(imagesArray[i]);
                sqlBindPrms.push(req.body.userid);
                sqlBindPrms.push(req.body.userid);
                sqlStmtImg = 
                `
                    INSERT INTO review_images (reviewid, image, created_by, modified_by)
                    VALUES (?, ?, ?, ?)
                `;
            }
            else if (imagesArray[i].imageid != NULL)
            {
                sqlBindPrms.push(imagesArray[i].image);
                sqlBindPrms.push(req.body.reviewid);
                sqlBindPrms.push(imagesArray[i].imageid);
                sqlStmtImg = 
                `
                    UPDATE review_images
                        SET image = ?
                    WHERE reviewid = ?
                        AND imageid = ?
                `;
            }

            const jsonSubmitImgPromise = mySqlConnection.execMySql(sqlStmtImg, sqlBindPrms);
            const jsonSubmitImgOutput = await jsonSubmitImgPromise;
            if (jsonSubmitImgOutput['status'] != 'SUCCESS')
            {
                console.log(jsonSubmitImgOutput);
                return gpusGeneral.buildJsonErrorMessage(`Failed to insert images for product with id: ${req.params.productid}`, req, res)
            }
            console.log(jsonSubmitImgOutput);
        }
    }

    const returnObj = {};
    returnObj['status'] = 'SUCCESS';
    returnObj['message'] = 'Successfully edited the review and images';
    returnObj['resultset'] = {};
    return returnObj;
}

apiArray.push(
    {
        method: 'PUT',
        handler: replyto_jsonEditReviews,
        path: 'jsonEditReviews',
        options:
        {
            public: true,
            description: 'edit reviews and images by productid',
            group: 'reviews'
        }
    }
);