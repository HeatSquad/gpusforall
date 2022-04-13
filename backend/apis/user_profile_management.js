const mySqlConnection = require('../shared/mysql.js');
const gpusGeneral = require('../shared/general.js');

const apiArray = []
module.exports = apiArray;

async function replyto_jsonCreateNewUser(req, res)
{
    if (req.body.username === undefined) return gpusGeneral.replywith_jsonInvalidParameters(`Missing required parameter: username`, req, res);
    if (req.body.first_name === undefined) return gpusGeneral.replywith_jsonInvalidParameters(`Missing required parameter: first_name`, req, res);
    if (req.body.last_name === undefined) return gpusGeneral.replywith_jsonInvalidParameters(`Missing required parameter: last_name`, req, res);
    if (req.body.email === undefined) return gpusGeneral.replywith_jsonInvalidParameters(`Missing required parameter: email`, req, res);
    if (req.body.password === undefined) return gpusGeneral.replywith_jsonInvalidParameters(`Missing required parameter: password`, req, res);

    const arrayBindParams = [];
    const sqlStmtCreateUser = `
    INSERT INTO sys.users 
         VALUES()`;
    const jsonCreateUserPromise = mySqlConnection.execMySql(sqlStmtCreateUser, arrayBindParams);
    const jsonCreateUserOutput = await jsonCreateUserPromise;
    if (jsonCreateUserOutput['status'] != 'SUCCESS') return gpusGeneral.replywith_jsonErrorMessage(`Failed to create new user`, req, res);

    return jsonCreateUserOutput;
}
apiArray.push(
    {
        method: 'POST',
        handler: replyto_jsonCreateNewUser,
        path: 'jsonCreateNewUser',
        options:
        {
            public: true,
            description: 'Creates a new Gpus4All user',
            group: 'User Profile Management'
        }
    }
);

async function replyto_jsonFetchUser(req, res)
{
    if (req.params.userid === undefined) return gpusGeneral.replywith_jsonInvalidParameters(`Missing required parameter: userid`, req, res);

    const userid = req.params.userid;

    const arrayBindParams = [];
    arrayBindParams.push(userid);
    const sqlStmtSelectUser = `
    SELECT userid,
           email,
           first_name,
           last_name,
           dob,
           json_address,
           json_user,
           created,
           modified,
           modified_by
    FROM sys.users
    WHERE userid = ?`;
    const jsonSelectUserPromise = mySqlConnection.execMySql(sqlStmtSelectUser, arrayBindParams);
    const jsonSelectUserOutput = await jsonSelectUserPromise;
    if (jsonSelectUserOutput['status'] != 'SUCCESS') return gpusGeneral.replywith_jsonErrorMessage(`Failed to fetch user with id: ${req.params.userid}`, req, res);

    return jsonSelectUserOutput;
}
apiArray.push(
    {
        method: 'GET',
        handler: replyto_jsonFetchUser,
        path: 'jsonFetchUser/:userid',
        options:
        {
            public: true,
            description: 'Fetches a Gpus4All user',
            group: 'User Profile Management'
        }
    }
);