const mySqlConnection = require('../shared/wrappers_mysql.js');
const gpusGeneral = require('../shared/general.js');

const apiArray = []
module.exports = apiArray;

async function replyto_jsonCreateNewUser(req, res)
{
    if (req.body.username === undefined) return gpusGeneral.replywith_jsonInvalidParameters(`Missing required parameter: username`, req, res);
    if (req.body.email === undefined) return gpusGeneral.replywith_jsonInvalidParameters(`Missing required parameter: email`, req, res);
    if (req.body.first_name === undefined) return gpusGeneral.replywith_jsonInvalidParameters(`Missing required parameter: first_name`, req, res);
    if (req.body.last_name === undefined) return gpusGeneral.replywith_jsonInvalidParameters(`Missing required parameter: last_name`, req, res);
    if (req.body.dob === undefined) return gpusGeneral.replywith_jsonInvalidParameters(`Missing required parameter: dob`, req, res);
    if (req.body.password === undefined) return gpusGeneral.replywith_jsonInvalidParameters(`Missing required parameter: password`, req, res);

    const arrayBindParams = [];
    arrayBindParams.push("USR-0000001");
    arrayBindParams.push(req.body.email);
    arrayBindParams.push(req.body.first_name);
    arrayBindParams.push(req.body.last_name);
    arrayBindParams.push(req.body.dob);
    arrayBindParams.push(req.body.password);
    arrayBindParams.push("system");
    const sqlStmtCreateUser = `
    INSERT INTO sys.users (userid, email, first_name, last_name, dob, password, modified_by)
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const jsonCreateUserPromise = mySqlConnection.execMySql(sqlStmtCreateUser, arrayBindParams);
    const jsonCreateUserOutput = await jsonCreateUserPromise;
    if (jsonCreateUserOutput['status'] != 'SUCCESS') return gpusGeneral.replywith_jsonErrorMessage(`Failed to create new user. ${jsonCreateUserOutput['message']}`, req, res);

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
            group: 'User Profile Management',
            sampleParams:
            {
                "username": "tnguyen1",
                "email": "thuch.nguyen@yahoo.com",
                "first_name": "Thuc",
                "last_name": "Nguyen",
                "dob": "1990-01-01",
                "password": "gottacatchemall"
            }
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
    WHERE userid = ?
      AND deleted = 'N'`;
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