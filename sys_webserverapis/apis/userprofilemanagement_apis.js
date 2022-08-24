const mySqlConnection = require('../../shared_server/wrappers_mysql.js');
const gpusGeneral = require('../../shared_server/general.js');
const nodemailer = require("nodemailer");

const apiArray = [];
module.exports = apiArray;

async function replyto_jsonCreateNewUser(req, res)
{
    if (req.body.user_name === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: user_name`, req, res);
    if (req.body.first_name === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: first_name`, req, res);
    if (req.body.last_name === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: last_name`, req, res);
    if (req.body.dob === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: dob`, req, res);
    if (req.body.email === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: email`, req, res);
    if (req.body.password === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: password`, req, res);

    const userName = req.body.user_name;
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const dob = req.body.dob;
    const email = req.body.email;
    const password = req.body.password;

    // Validate inputs
    if (userName.length <= 0) return gpusGeneral.buildJsonErrorMessage(`Username is empty.`, req, res);
    if (userName.length > 30) return gpusGeneral.buildJsonErrorMessage(`Username cannot be longer than 30 characters.`, req, res);
    
    if (firstName.length <= 0) return gpusGeneral.buildJsonErrorMessage(`First name is empty.`, req, res);
    if (firstName.length > 100) return gpusGeneral.buildJsonErrorMessage(`First name cannot be longer than 100 characters.`, req, res);

    if (lastName.length <= 0) return gpusGeneral.buildJsonErrorMessage(`Last name is empty.`, req, res);
    if (lastName.length > 100) return gpusGeneral.buildJsonErrorMessage(`Last name cannot be longer than 100 characters.`, req, res);

    if (dob.length <= 0) return gpusGeneral.buildJsonErrorMessage(`Date of Birth is empt.`);
    if (dob.length > 10) return gpusGeneral.buildJsonErrorMessage(`Date of Birth cannot be longer than 10 characters.`);
    const dobRegex = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
    if (!dobRegex.test(dob)) return gpusGeneral.buildJsonErrorMessage(`Date of Birth is an invalid format.`);

    if (email.length <= 0) return gpusGeneral.buildJsonErrorMessage(`Email is empty.`, req, res);
    if (email.length > 320) return gpusGeneral.buildJsonErrorMessage(`Email cannot be longer than 320 characters.`, req, res);

    if (password.length <= 0) return gpusGeneral.buildJsonErrorMessage(`Password is empty.`, req, res);
    if (password.length < 12) return gpusGeneral.buildJsonErrorMessage(`Password must be at least 12 characters.`, req, res);
    if (password.length > 100) return gpusGeneral.buildJsonErrorMessage(`Password cannot be longer than 100 characters.`, req, res);

    // Check if user name exists
    const arrayBindParamCheckUserNameExists = [userName];

    const sqlStmtCheckUserNameExists = `
    SELECT username
      FROM sys.users
     WHERE username = ?
    `;

    const jsonCheckUserNameExistsPromise = mySqlConnection.execMySql(sqlStmtCheckUserNameExists, arrayBindParamCheckUserNameExists);
    const jsonCheckUserNameExistsOutput = await jsonCheckUserNameExistsPromise;
    if (jsonCheckUserNameExistsOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to check if username exists.`, req, res);

    console.log(jsonCheckUserNameExistsOutput.resultset);

    if (jsonCheckUserNameExistsOutput.resultset.length > 0) return gpusGeneral.buildJsonErrorMessage(`${jsonCheckUserNameExistsOutput.resultset[0].username} already exists. Please try another user name.`, req, res);

    // Check if email exists
    const arrayBindParamCheckEmailExists = [email];

    const sqlStmtCheckEmailExists = `
    SELECT email
      FROM sys.users
     WHERE email = ?
    `;

    const jsonCheckEmailExistsPromise = mySqlConnection.execMySql(sqlStmtCheckEmailExists, arrayBindParamCheckEmailExists);
    const jsonCheckEmailExistsOutput = await jsonCheckEmailExistsPromise;
    if (jsonCheckEmailExistsOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to check if email exists.`, req, res);

    console.log(jsonCheckEmailExistsOutput.resultset);

    if (jsonCheckEmailExistsOutput.resultset.length > 0) return gpusGeneral.buildJsonErrorMessage(`${jsonCheckEmailExistsOutput.resultset[0].email} already exists. Please try another email.`, req, res);

    // Encrypt password
    const jsonGenerateSaltOutput = await gpusGeneral.cryptoRandomBytes(32);
    if (jsonGenerateSaltOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to generate salt`, req, res);
    if (jsonGenerateSaltOutput['status'].length <= 0) return gpusGeneral.buildJsonErrorMessage(`Failed to generate salt because resultset was empty`, req, res);
    const saltBuffer = jsonGenerateSaltOutput['resultset'][0]['buf'];
    const salt = saltBuffer.toString('hex');

    const encryptedPassword = gpusGeneral.cryptoHashMessage256Bit(password, salt);
    if (encryptedPassword == null) return gpusGeneral.buildJsonErrorMessage(`Salt is incorrect length`, req, res);

    const arrayBindParamsCreateUser = [];
    arrayBindParamsCreateUser.push(userName);
    arrayBindParamsCreateUser.push(firstName);
    arrayBindParamsCreateUser.push(lastName);
    arrayBindParamsCreateUser.push(dob);
    arrayBindParamsCreateUser.push(email);
    arrayBindParamsCreateUser.push(encryptedPassword);
    arrayBindParamsCreateUser.push(salt);
    arrayBindParamsCreateUser.push(userName);

    const sqlStmtCreateUser = `
    INSERT INTO sys.users (username, first_name, last_name, dob, email, password, salt, modified_by)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const jsonCreateUserPromise = mySqlConnection.execMySql(sqlStmtCreateUser, arrayBindParamsCreateUser);
    const jsonCreateUserOutput = await jsonCreateUserPromise;
    if (jsonCreateUserOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to create new user. ${jsonCreateUserOutput['message']}`, req, res);

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
                "password": "gottacatchemall",
                "email": "thuch.nguyen@yahoo.com",
                "first_name": "Thuc",
                "last_name": "Nguyen",
                "dob": "1990-01-01",
            }
        }
    }
);

async function replyto_jsonSendActivationEmail(req, res)
{
  console.log('You hit the replyto_jsonSendActivationEmail API');

  if (req.body.email === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: email`, req, res);

  const email = req.body.email;

   // Check if email exists
   const arrayBindParamCheckEmailExists = [email];

   const sqlStmtCheckEmailExists = `
   SELECT email, verified
     FROM sys.users
    WHERE email = ?
   `;

   const jsonCheckEmailExistsPromise = mySqlConnection.execMySql(sqlStmtCheckEmailExists, arrayBindParamCheckEmailExists);
   const jsonCheckEmailExistsOutput = await jsonCheckEmailExistsPromise;
   if (jsonCheckEmailExistsOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to check if email exists.`, req, res);

   console.log(jsonCheckEmailExistsOutput.resultset);

   if (jsonCheckEmailExistsOutput.resultset.length == 0) return gpusGeneral.buildJsonErrorMessage(`${email} does not exist. Please try another email or create a new account.`, req, res);

   // Check if already verified.
   //   If already verified,then send error message stating this account has already been activated and return.
   //   No need to continue...
   const jsonResultSet = jsonCheckEmailExistsOutput.resultset[0];
   const verified = jsonResultSet['verified'];
   if (verified == 1) return gpusGeneral.buildJsonErrorMessage(`The account for ${email} already has been activated.`, req, res);

  // Generate random alphanumeric
  let alphaNumeric = '0123456789z0S0bAyxal1ghG89VIEL23XOND5Uwk6e1Pc381H5mC24B74s6M985duQjTW0pq9JfK4o62Rtiv73Fr7n';
  let len = 6;
  let message = [];
  for (let i = 0; i < len; i++) {
    let index = Math.floor(Math.random() * alphaNumeric.length);
    message.push(alphaNumeric.charAt(index));
  }
  message = message.join('');

  console.log(message);

  let salt = await gpusGeneral.cryptoRandomBytes(32);
  salt = salt.resultset[0].buf.toString('hex');
  console.log(salt);

  let hash = gpusGeneral.cryptoHashMessage256Bit(message, salt);
  console.log(hash);

  let expires = new Date();
  console.log(expires);
  expires = `${expires.getFullYear().toString().padStart(2,0)}-${(expires.getMonth() + 1).toString().padStart(2, 0)}-${(expires.getDate() + 1).toString().padStart(2, 0)} ${expires.getHours().toString().padStart(2, 0)}:${expires.getMinutes().toString().padStart(2, 0)}:${expires.getSeconds().toString().padStart(2, 0)}`;
  console.log(expires);

  // Save hash
  const jsonUser = {};
  jsonUser['hash'] = hash;
  jsonUser['expires'] = expires;

  const arrayBindParamSaveHash = [];
  arrayBindParamSaveHash.push(salt);
  arrayBindParamSaveHash.push(JSON.stringify(jsonUser));
  arrayBindParamSaveHash.push(email);

  const sqlStmtSaveHash = `
  UPDATE sys.users
  SET salt = ?, json_user = ?
  WHERE email = ?
  `;

  const jsonSaveHashPromise = mySqlConnection.execMySql(sqlStmtSaveHash, arrayBindParamSaveHash);
  const jsonSaveHashOutput = await jsonSaveHashPromise;
  if (jsonSaveHashOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to save hash.`, req, res);
  if (jsonSaveHashOutput['affectedRows'] == 0) return gpusGeneral.buildJsonErrorMessage(`Failed to save hash.`, req, res);

  console.log(jsonSaveHashOutput);

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "heatsquad4@gmail.com", // generated ethereal user
      pass: "fychaoznlihatpiy", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Heat Squad 👻" <heatsquad4@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Activate Your Account", // Subject line
    text: "To get started, please activate your account.", // plain text body
    html: `
    Greetings!
    <br><br>Please use your activation code to <a target="_blank" href="http://localhost:8080/activate-account">activate your account</a>.
    <br><br>    <b>Activation Code</b>: ${message}
    <br>*Expires in 1 day
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

  info['status'] = 'SUCCESS';
  info['message'] = 'Activation email successfully sent';
  info['resultset'] = '';
  
  console.log(info);

  return info;
}
apiArray.push(
    {
        method: 'POST',
        handler: replyto_jsonSendActivationEmail,
        path: 'jsonSendActivationEmail',
        options:
        {
            public: true,
            description: '',
            group: '',
            sampleParams:
            {
                "email": "thuch.nguyen@yahoo.com",
            }
        }
    }
);

// Create verify function here
// Query users table using their inputs from the confirm page
// Check if the user is already verified, then exit
// Another check is to see if expired already
// When the user enters the act code on the confirm page, that's the act code they're using to attempt to verify themselves
// Take the salt in json_user and hash whatever the user entered as the act code in the confirm page.
// That result is the same as the hash that was saved initally in json_user.
// If same, set verified to 1, else.....send error message
async function replyto_jsonVerifyUser(req, res)
{
    console.log(`replyto_jsonVerifyUser was hit!!!!`);
    console.log(req.body);
    if (req.body.userName === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: userName`, req, res);
    if (req.body.email === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: email`, req, res);
    if (req.body.activationCode === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: activationCode`, req, res);

    const userName = req.body.userName;
    const email = req.body.email;
    const activationCode = req.body.activationCode;

    // Validate inputs
    if (userName.length <= 0) return gpusGeneral.buildJsonErrorMessage(`Username is empty.`, req, res);
    if (userName.length > 30) return gpusGeneral.buildJsonErrorMessage(`Username cannot be longer than 30 characters.`, req, res);

    if (email.length <= 0) return gpusGeneral.buildJsonErrorMessage(`Email is empty.`, req, res);
    if (email.length > 320) return gpusGeneral.buildJsonErrorMessage(`Email cannot be longer than 320 characters.`, req, res);

    if (activationCode.length <= 0) return gpusGeneral.buildJsonErrorMessage(`Acivation code.`, req, res);
    if (activationCode.length < 6) return gpusGeneral.buildJsonErrorMessage(`Acivation code must be at least 6 characters.`, req, res);
    if (activationCode.length > 6) return gpusGeneral.buildJsonErrorMessage(`Acivation code cannot be longer than 6 characters.`, req, res);

    // Check if user name exists
    const arrayBindParamCheckUserNameExists = [userName];

    const sqlStmtCheckUserNameExists = `
    SELECT username
      FROM sys.users
     WHERE username = ?
    `;

    const jsonCheckUserNameExistsPromise = mySqlConnection.execMySql(sqlStmtCheckUserNameExists, arrayBindParamCheckUserNameExists);
    const jsonCheckUserNameExistsOutput = await jsonCheckUserNameExistsPromise;
    if (jsonCheckUserNameExistsOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to check if username exists.`, req, res);

    console.log(jsonCheckUserNameExistsOutput.resultset);

    if (jsonCheckUserNameExistsOutput.resultset.length <= 0) return gpusGeneral.buildJsonErrorMessage(`${jsonCheckUserNameExistsOutput.resultset[0].username} does not exist. Please try another user name.`, req, res);

    // Check if email exists
    const arrayBindParamCheckEmailExists = [email];

    const sqlStmtCheckEmailExists = `
    SELECT email
      FROM sys.users
     WHERE email = ?
    `;

    const jsonCheckEmailExistsPromise = mySqlConnection.execMySql(sqlStmtCheckEmailExists, arrayBindParamCheckEmailExists);
    const jsonCheckEmailExistsOutput = await jsonCheckEmailExistsPromise;
    if (jsonCheckEmailExistsOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to check if email exists.`, req, res);

    console.log(jsonCheckEmailExistsOutput.resultset);

    if (jsonCheckEmailExistsOutput.resultset.length <= 0) return gpusGeneral.buildJsonErrorMessage(`${email} does not exist. Please try another email.`, req, res);

    // Get hash, expires, salt, verified, and CURRENT_TIMESTAMP, check if verified and the hashes match
    const arrayBindParamCheckIfVerified = [userName, email];

    const sqlStmtCheckIfVerified = `
    SELECT verified, salt, json_user, DATE_FORMAT(CURRENT_TIMESTAMP, '%Y-%m-%d %T') AS timestamp
      FROM sys.users
     WHERE username = ?
       AND email = ?
    `;

    const jsonCheckIfVerifiedPromise = mySqlConnection.execMySql(sqlStmtCheckIfVerified, arrayBindParamCheckIfVerified);
    const jsonCheckIfVerifiedOutput = await jsonCheckIfVerifiedPromise;
    if (jsonCheckIfVerifiedOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to check if verified, get salt, and expires`, req, res);

    console.log(jsonCheckIfVerifiedOutput.resultset);
    console.log(jsonCheckIfVerifiedOutput.resultset[0]['json_user']);

    const verified = jsonCheckIfVerifiedOutput.resultset[0]['verified'];
    const salt = jsonCheckIfVerifiedOutput.resultset[0]['salt'];
    const currentTimeStamp = jsonCheckIfVerifiedOutput.resultset[0]['timestamp'];
    const jsonUser = jsonCheckIfVerifiedOutput.resultset[0]['json_user'];
    const hash = jsonUser['hash'];
    const expires = jsonUser['expires'];
    console.log(hash);
    console.log(new Date(expires));
    console.log(verified);
    console.log(salt);
    console.log(new Date(currentTimeStamp));

    if (verified) return gpusGeneral.buildJsonErrorMessage(`Your user account has already been verified`, req, res);

    let activationCodeHash = gpusGeneral.cryptoHashMessage256Bit(activationCode, salt);

    if (hash != activationCodeHash) return gpusGeneral.buildJsonErrorMessage(`Invalid activation code. Please try again.`, req, res);

    console.log(`hash: ${hash}`);
    console.log(`activationCodeHash: ${activationCodeHash}`);

    if (new Date(currentTimeStamp) >= new Date(expires)) return gpusGeneral.buildJsonErrorMessage(`Activation code has expired. Please request another activation email.`, req, res);

    // Update verified to true
    const arrayBindParamActivateAccount = [];
    arrayBindParamActivateAccount.push(email);
    arrayBindParamActivateAccount.push(userName);
    arrayBindParamActivateAccount.push(salt);

    const sqlStmtActivateAccount = `
    UPDATE sys.users
    SET verified = 1
    WHERE email = ?
    AND username = ?
    AND salt = ?
    `;

    const jsonActivateAccountPromise = mySqlConnection.execMySql(sqlStmtActivateAccount, arrayBindParamActivateAccount);
    const jsonActivateAccountOutput = await jsonActivateAccountPromise;
    if (jsonActivateAccountOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to activate account.`, req, res);
    if (jsonActivateAccountOutput['affectedRows'] == 0) return gpusGeneral.buildJsonErrorMessage(`Failed to set account to activated.`, req, res);

    return jsonActivateAccountOutput;
}
apiArray.push(
    {
        method: 'POST',
        handler: replyto_jsonVerifyUser,
        path: 'jsonVerifyUser',
        options:
        {
            public: true,
            description: '',
            group: 'User Profile Management',
            sampleParams:
            {
                "userName": "tnguyen1",
                "email": "thuch.nguyen@yahoo.com",
                "activationCode": "gottacatchemall"
            }
        }
    }
);

async function replyto_jsonFetchUser(req, res)
{
    if (req.params.userid === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: userid`, req, res);

    const userid = req.params.userid;

    const arrayBindParams = [];
    arrayBindParams.push(userid);
    const sqlStmtSelectUser = `
    SELECT userid,
           email,
           first_name,
           last_name,
           DATE_FORMAT(dob, '%Y-%m-%d') AS dob,
           json_address,
           JSON_VALUE(json_user, '$.phone_number') AS "phone_number",
           created,
           modified,
           modified_by
    FROM sys.users
    WHERE userid = ?
      AND deleted = 'N'
    `;
    const jsonSelectUserPromise = mySqlConnection.execMySql(sqlStmtSelectUser, arrayBindParams);
    const jsonSelectUserOutput = await jsonSelectUserPromise;
    if (jsonSelectUserOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to fetch user with id: ${userid}`, req, res);

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

async function replyto_jsonFetchUserPaymentInfo(req, res)
{
    if (req.params.userid === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: userid`, req, res);

    const userid = req.params.userid;

    const arrayBindParamsGetUser = [];
    arrayBindParamsGetUser.push(userid);
    const sqlStmtGetUser = `
    SELECT userid,
           JSON_EXTRACT(json_user, '$.credit_cards') AS "credit_cards"
    FROM sys.users
    WHERE userid = ?
      AND deleted = 'N'
    `;
    const jsonGetUserPromise = mySqlConnection.execMySql(sqlStmtGetUser, arrayBindParamsGetUser);
    const jsonGetUserOutput = await jsonGetUserPromise;
    if (jsonGetUserOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to fetch user's payment information with id: ${userid}`, req, res);
    if (jsonGetUserOutput['resultset'].length <= 0) return gpusGeneral.buildJsonSuccessMessage(`Retrieved payment information`, [], req, res); //TODO: fix

    const jsonEntry = jsonGetUserOutput['resultset'][0];
    const jsonCreditCards = JSON.parse(jsonEntry['credit_cards']);
    if (!jsonCreditCards) return gpusGeneral.buildJsonSuccessMessage(`Retrieved payment information`, [], req, res); //TODO: fix
    console.log(jsonCreditCards);

    // Loop through each credit card info and prepare json array
    const arrayJsonDecryptedCreditCards = [];
    for (const [uuid, jsonCreditCard] of Object.entries(jsonCreditCards))
    {
        // Validate, extract, and decrypt
        const cardInfoHex = jsonCreditCard['card_info'];
        const isPrimary = jsonCreditCard['is_primary'];

        const iv = cardInfoHex.slice(0, 32);
        const cipherText = cardInfoHex.slice(32);
        const decryptedCipherText = gpusGeneral.cryptoDecryptCardInfoAES(cipherText, iv);
        if (decryptedCipherText == null) return gpusGeneral.buildJsonErrorMessage(`Failed to decrypt card info for user with id ${userid}`, req, res);
        const jsonDecryptedCardInfo = JSON.parse(decryptedCipherText);
        const cardNumber = jsonDecryptedCardInfo['card_number'];
        const lastFourDigits = cardNumber.slice(-4);
        jsonDecryptedCardInfo['last_four_digits'] = lastFourDigits;
        jsonDecryptedCardInfo['is_primary'] = isPrimary;
        jsonDecryptedCardInfo['uuid'] = uuid;
        delete jsonDecryptedCardInfo['cardholder_name'];
        delete jsonDecryptedCardInfo['card_number'];
        arrayJsonDecryptedCreditCards.push(jsonDecryptedCardInfo);
    }

    return gpusGeneral.buildJsonSuccessMessage(`Retrieved payment information`, arrayJsonDecryptedCreditCards, req, res);
}
apiArray.push(
    {
        method: 'GET',
        handler: replyto_jsonFetchUserPaymentInfo,
        path: 'jsonFetchUserPaymentInfo/:userid',
        options:
        {
            public: true,
            description: 'Fetches a Gpus4All user\'s payment information',
            group: 'User Profile Management'
        }
    }
);

async function replyto_jsonUpdateUserFullName(req, res)
{
    if (req.body.userid === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: userid`, req, res);
    if (req.body.first_name === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: first_name`, req, res);
    if (req.body.last_name === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: last_name`, req, res);

    const userid = req.body.userid;
    const firstName = req.body.first_name.trim();
    const lastName = req.body.last_name.trim();

    // Validate Name
    if (firstName.length <= 0) return gpusGeneral.buildJsonErrorMessage(`First name is empty`, req, res);
    if (firstName.length > 100) return gpusGeneral.buildJsonErrorMessage(`First name cannot be longer than 100 characters`, req, res);
    if (lastName.length <= 0) return gpusGeneral.buildJsonErrorMessage(`Last name is empty`, req, res);
    if (lastName.length > 100) return gpusGeneral.buildJsonErrorMessage(`Last name cannot be longer than 100 characters`, req, res);

    const arrayBindParams = [];
    arrayBindParams.push(firstName);
    arrayBindParams.push(lastName);
    arrayBindParams.push(userid);
    const sqlStmtUpdateUser = `
    UPDATE sys.users
    SET first_name = ?,
        last_name = ?
    WHERE userid = ?
      AND deleted = 'N'
    `;
    const jsonUpdateUserPromise = mySqlConnection.execMySql(sqlStmtUpdateUser, arrayBindParams);
    const jsonUpdateUserOutput = await jsonUpdateUserPromise;
    if (jsonUpdateUserOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to update full name of user with id: ${userid}`, req, res);

    return jsonUpdateUserOutput;
}
apiArray.push(
    {
        method: 'PUT',
        handler: replyto_jsonUpdateUserFullName,
        path: 'jsonUpdateUserFullName',
        options:
        {
            public: true,
            description: 'Updates full name of a Gpus4All user',
            group: 'User Profile Management',
            sampleParams:
            {
                "userid": "USR00001",
                "first_name": "Thuc",
                "last_name": "Nguyen",
            }
        }
    }
);

async function replyto_jsonUpdateUserEmail(req, res)
{
    if (req.body.userid === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: userid`, req, res);
    if (req.body.email === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: email`, req, res);

    const userid = req.body.userid;
    const email = req.body.email.trim();

    // Validate Email
    if (email.length <= 0) return gpusGeneral.buildJsonErrorMessage(`Email is empty`);
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) return gpusGeneral.buildJsonErrorMessage(`Email is an invalid format`, req, res);

    // TODO: Send email verification again

    const arrayBindParams = [];
    arrayBindParams.push(email);
    arrayBindParams.push(userid);
    const sqlStmtUpdateUser = `
    UPDATE sys.users
    SET email = ?,
        verified = FALSE
    WHERE userid = ?
      AND deleted = 'N'
    `;
    const jsonUpdateUserPromise = mySqlConnection.execMySql(sqlStmtUpdateUser, arrayBindParams);
    const jsonUpdateUserOutput = await jsonUpdateUserPromise;
    if (jsonUpdateUserOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to update email of user with id: ${userid}`, req, res);

    return jsonUpdateUserOutput;
}
apiArray.push(
    {
        method: 'PUT',
        handler: replyto_jsonUpdateUserEmail,
        path: 'jsonUpdateUserEmail',
        options:
        {
            public: true,
            description: 'Updates email of a Gpus4All user',
            group: 'User Profile Management',
            sampleParams:
            {
                "userid": "USR00001",
                "email": "thucnguyen12345@gmail.com",
            }
        }
    }
);

async function replyto_jsonUpdateUserPhoneNumber(req, res)
{
    if (req.body.userid === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: userid`, req, res);
    if (req.body.phone === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: phone`, req, res);
    const userid = req.body.userid;
    const phone = req.body.phone.trim();

    // Validate phone
    if (phone.length <= 0) return gpusGeneral.buildJsonErrorMessage(`Phone is empty`);
    if (phone.length > 10) return gpusGeneral.buildJsonErrorMessage(`Phone cannot be longer than 10 characters`);
    // const phoneRegex = /[0-9]{3}-[0-9]{3}-[0-9]{4}/;
    const phoneRegex = /[0-9]{10}/;
    if (!phoneRegex.test(phone)) return gpusGeneral.buildJsonErrorMessage(`Phone is an invalid format`);

    const arrayBindParams = [];
    arrayBindParams.push(phone);
    arrayBindParams.push(userid);
    const sqlStmtUpdateUser = `
    UPDATE sys.users
    SET json_user = JSON_SET(IFNULL(json_user, '{}'), '$.phone_number', ?)
    WHERE userid = ?
      AND deleted = 'N'
    `;
    const jsonUpdateUserPromise = mySqlConnection.execMySql(sqlStmtUpdateUser, arrayBindParams);
    const jsonUpdateUserOutput = await jsonUpdateUserPromise;
    if (jsonUpdateUserOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to update phone of user with id: ${userid}`, req, res);

    return jsonUpdateUserOutput;
}
apiArray.push(
    {
        method: 'PUT',
        handler: replyto_jsonUpdateUserPhoneNumber,
        path: 'jsonUpdateUserPhoneNumber',
        options:
        {
            public: true,
            description: 'Updates phone number of a Gpus4All user',
            group: 'User Profile Management',
            sampleParams:
            {
                "userid": "USR00001",
                "phone": "1234567890"
            }
        }
    }
);

async function replyto_jsonUpdateUserDob(req, res)
{
    if (req.body.userid === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: userid`, req, res);
    if (req.body.dob === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: dob`, req, res);

    const userid = req.body.userid;
    const dob = req.body.dob.trim();

    // Validate phone
    if (dob.length <= 0) return gpusGeneral.buildJsonErrorMessage(`Date of Birth is empty`);
    if (dob.length > 10) return gpusGeneral.buildJsonErrorMessage(`Date of Birth cannot be longer than 10 characters`);
    const dobRegex = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
    if (!dobRegex.test(dob)) return gpusGeneral.buildJsonErrorMessage(`Date of Birth is an invalid format`);

    const arrayBindParams = [];
    arrayBindParams.push(dob);
    arrayBindParams.push(userid);
    const sqlStmtUpdateUser = `
    UPDATE sys.users
    SET dob = ?
    WHERE userid = ?
      AND deleted = 'N'
    `;
    const jsonUpdateUserPromise = mySqlConnection.execMySql(sqlStmtUpdateUser, arrayBindParams);
    const jsonUpdateUserOutput = await jsonUpdateUserPromise;
    if (jsonUpdateUserOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to update date of birth of user with id: ${userid}`, req, res);

    return jsonUpdateUserOutput;
}
apiArray.push(
    {
        method: 'PUT',
        handler: replyto_jsonUpdateUserDob,
        path: 'jsonUpdateUserDob',
        options:
        {
            public: true,
            description: 'Updates date of birth of a Gpus4All user',
            group: 'User Profile Management',
            sampleParams:
            {
                "userid": "USR00001",
            }
        }
    }
);

async function replyto_jsonUpdateUserPassword(req, res)
{
    if (req.body.userid === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: userid`, req, res);
    if (req.body.current_password === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: current_password`, req, res);
    if (req.body.new_password === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: new_password`, req, res);

    const userid = req.body.userid;
    const currentPassword = req.body.current_password;
    const newPassword = req.body.new_password;

    // Validate new password
    if (newPassword.length === 0) return gpusGeneral.buildJsonErrorMessage(`New password is empty`, req, res);
    if (newPassword.length < 12) return gpusGeneral.buildJsonErrorMessage(`New password must be at least 12 characters`, req, res);
    if (newPassword.length > 100) return gpusGeneral.buildJsonErrorMessage(`New password cannot be longer than 100 characters`, req, res);

    // Validate current password
    const arrayBindParamsGetUserInfo = [];
    arrayBindParamsGetUserInfo.push(userid);
    const sqlStmtGetUserInfo = `
    SELECT password, 
           salt 
    FROM sys.users
    WHERE userid = ?
      AND deleted = 'N'
    `;
    const jsonGetUserInfoPromise = mySqlConnection.execMySql(sqlStmtGetUserInfo, arrayBindParamsGetUserInfo);
    const jsonGetUserInfoOutput = await jsonGetUserInfoPromise;
    if (jsonGetUserInfoOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to get user info with id ${userid}`, req, res);
    if (jsonGetUserInfoOutput['resultset'].length <= 0)  return gpusGeneral.buildJsonErrorMessage(`Failed to get user info because resultset was empty for user with id ${userid}`, req, res);
    const jsonUserInfo = jsonGetUserInfoOutput['resultset'][0];
    const remotePassword = jsonUserInfo['password'];
    const remoteSalt = jsonUserInfo['salt'];
    const hashedCurrentPassword = gpusGeneral.cryptoHashMessage256Bit(currentPassword, remoteSalt);
    if (hashedCurrentPassword !== remotePassword) return gpusGeneral.buildJsonErrorMessage(`Current password is incorrect`, req, res);

    // Encrypt new password
    const jsonGenerateSaltOutput = await gpusGeneral.cryptoRandomBytes(32);
    if (jsonGenerateSaltOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to generate salt`, req, res);
    if (jsonGenerateSaltOutput['status'].length <= 0) return gpusGeneral.buildJsonErrorMessage(`Failed to generate salt because resultset was empty for user with id ${userid}`, req, res);
    const saltBuffer = jsonGenerateSaltOutput['resultset'][0]['buf'];
    const salt = saltBuffer.toString('hex');

    const encryptedPassword = gpusGeneral.cryptoHashMessage256Bit(newPassword, salt);
    if (encryptedPassword == null) return gpusGeneral.buildJsonErrorMessage(`Salt is incorrect length`, req, res);
    
    const arrayBindParams = [];
    arrayBindParams.push(encryptedPassword);
    arrayBindParams.push(salt);
    arrayBindParams.push(userid);
    const sqlStmtUpdateUser = `
    UPDATE sys.users
    SET password = ?,
        password_reset = CURRENT_TIMESTAMP,
        salt = ?
    WHERE userid = ?
      AND deleted = 'N'
    `;
    const jsonUpdateUserPromise = mySqlConnection.execMySql(sqlStmtUpdateUser, arrayBindParams);
    const jsonUpdateUserOutput = await jsonUpdateUserPromise;
    if (jsonUpdateUserOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to update password for user with id ${userid}`, req, res);

    return jsonUpdateUserOutput;
}
apiArray.push(
    {
        method: 'PUT',
        handler: replyto_jsonUpdateUserPassword,
        path: 'jsonUpdateUserPassword',
        options:
        {
            public: true,
            description: 'Updates password of a Gpus4All user',
            group: 'User Profile Management',
            sampleParams:
            {
                "userid": "USR00001",
                "password": "gottacatchemall"
            }
        }
    }
);

async function replyto_jsonUpdateUserShippingAddress(req, res)
{
    if (req.body.userid === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: userid`, req, res);
    if (!req.body.street1 && !req.body.street2 && !req.body.city && !req.body.state && !req.body.zipCode && !req.body.country) return gpusGeneral.buildJsonInvalidParameters(`No parameters provided`, req, res);

    const userid = req.body.userid;

    // Validate shipping address information
    if (req.body.street1 && req.body.street1.length === 0) return gpusGeneral.buildJsonErrorMessage(`Street and number is empty`, req, res);
    if (req.body.street1 && req.body.street1.length > 100)  return gpusGeneral.buildJsonErrorMessage(`Street and number cannot be longer than 100 characters`, req, res);
    if (req.body.street2 && req.body.street2.length > 100) return gpusGeneral.buildJsonErrorMessage(`Apartment, suite, building, etc. cannot be longer than 100 characters`, req, res);
    if (req.body.city && req.body.city.length === 0) return gpusGeneral.buildJsonErrorMessage(`City is empty`, req, res);
    if (req.body.city && req.body.city.length > 50) return gpusGeneral.buildJsonErrorMessage(`City cannot be longer than 50 characters`, req, res);
    if (req.body.state && req.body.state.length === 0) return gpusGeneral.buildJsonErrorMessage(`State is empty`, req, res);
    if (req.body.state && req.body.state.length != 2) return gpusGeneral.buildJsonErrorMessage(`State is invalid`, req, res);
    const stateRegex = /[A-Z]{2}/;
    if (req.body.state && !stateRegex.test(req.body.state)) return gpusGeneral.buildJsonErrorMessage(`State is invalid`, req, res);
    if (req.body.zipCode && req.body.zipCode.length === 0) return gpusGeneral.buildJsonErrorMessage(`Zip Code is empty`, req, res);
    if (req.body.zipCode && req.body.zipCode.length != 5) return gpusGeneral.buildJsonErrorMessage(`Zip Code is invalid`, req, res);
    const zipCodeRegex = /[0-9]{5}/;
    if (req.body.zipCode && !zipCodeRegex.test(req.body.zipCode)) return gpusGeneral.buildJsonErrorMessage(`Zip Code is invalid`, req, res);
    if (req.body.country && req.body.country.length === 0) return gpusGeneral.buildJsonErrorMessage(`Country is empty`, req, res);
    if (req.body.country && req.body.country.length > 80) return gpusGeneral.buildJsonErrorMessage(`Country cannot be longer than 80 characters`, req, res);

    const jsonShippingAddress = {};
    jsonShippingAddress['shipping'] = {};
    if (req.body.street1)   jsonShippingAddress['shipping']['street1'] = req.body.street1;
    if (req.body.street2)   jsonShippingAddress['shipping']['street2'] = req.body.street2;
    if (req.body.city)      jsonShippingAddress['shipping']['city'] = req.body.city;
    if (req.body.state)     jsonShippingAddress['shipping']['state'] = req.body.state;
    if (req.body.zipCode)   jsonShippingAddress['shipping']['zip_code'] = req.body.zipCode;
    if (req.body.country)   jsonShippingAddress['shipping']['country'] = req.body.country;

    const arrayBindParams = [];
    arrayBindParams.push(JSON.stringify(jsonShippingAddress));
    arrayBindParams.push(userid);
    const sqlStmtUpdateUser = `
    UPDATE sys.users
    SET json_address = JSON_MERGE_PATCH(IFNULL(json_address, '{}'), ?)
    WHERE userid = ?
      AND deleted = 'N'
    `;
    const jsonUpdateUserPromise = mySqlConnection.execMySql(sqlStmtUpdateUser, arrayBindParams);
    const jsonUpdateUserOutput = await jsonUpdateUserPromise;
    if (jsonUpdateUserOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to update shipping address of user with id: ${userid}`, req, res);

    return jsonUpdateUserOutput;
}
apiArray.push(
    {
        method: 'PUT',
        handler: replyto_jsonUpdateUserShippingAddress,
        path: 'jsonUpdateUserShippingAddress',
        options:
        {
            public: true,
            description: 'Updates shipping address of a Gpus4All user',
            group: 'User Profile Management',
            sampleParams:
            {
                "userid": "USR00001",
                "street1": "1234 Graphics St",
                "street2": "Apt #132",
                "city": "Graphics City",
                "state": "CA",
                "zipCode": "90123",
                "country": "USA",
            }
        }
    }
);

async function replyto_jsonUpdateUserBillingAddress(req, res)
{
    if (req.body.userid === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: userid`, req, res);
    if (!req.body.street1 && !req.body.street2 && !req.body.city && !req.body.state && !req.body.zipCode && !req.body.country) return gpusGeneral.buildJsonInvalidParameters(`No parameters provided`, req, res);

    const userid = req.body.userid;

    // Validate billing address information
    if (req.body.street1 && req.body.street1.length === 0) return gpusGeneral.buildJsonErrorMessage(`Street and number is empty`, req, res);
    if (req.body.street1 && req.body.street1.length > 100)  return gpusGeneral.buildJsonErrorMessage(`Street and number cannot be longer than 100 characters`, req, res);
    if (req.body.street2 && req.body.street2.length > 100) return gpusGeneral.buildJsonErrorMessage(`Apartment, suite, building, etc. cannot be longer than 100 characters`, req, res);
    if (req.body.city && req.body.city.length === 0) return gpusGeneral.buildJsonErrorMessage(`City is empty`, req, res);
    if (req.body.city && req.body.city.length > 50) return gpusGeneral.buildJsonErrorMessage(`City cannot be longer than 50 characters`, req, res);
    if (req.body.state && req.body.state.length === 0) return gpusGeneral.buildJsonErrorMessage(`State is empty`, req, res);
    if (req.body.state && req.body.state.length != 2) return gpusGeneral.buildJsonErrorMessage(`State is invalid`, req, res);
    const stateRegex = /[A-Z]{2}/;
    if (req.body.state && !stateRegex.test(req.body.state)) return gpusGeneral.buildJsonErrorMessage(`State is invalid`, req, res);
    if (req.body.zipCode && req.body.zipCode.length === 0) return gpusGeneral.buildJsonErrorMessage(`Zip Code is empty`, req, res);
    if (req.body.zipCode && req.body.zipCode.length != 5) return gpusGeneral.buildJsonErrorMessage(`Zip Code is invalid`, req, res);
    const zipCodeRegex = /[0-9]{5}/;
    if (req.body.zipCode && !zipCodeRegex.test(req.body.zipCode)) return gpusGeneral.buildJsonErrorMessage(`Zip Code is invalid`, req, res);
    if (req.body.country && req.body.country.length === 0) return gpusGeneral.buildJsonErrorMessage(`Country is empty`, req, res);
    if (req.body.country && req.body.country.length > 80) return gpusGeneral.buildJsonErrorMessage(`Country cannot be longer than 80 characters`, req, res);

    const jsonBillingAddress = {};
    jsonBillingAddress['billing'] = {};
    if (req.body.street1)   jsonBillingAddress['billing']['street1'] = req.body.street1;
    if (req.body.street2)   jsonBillingAddress['billing']['street2'] = req.body.street2;
    if (req.body.city)      jsonBillingAddress['billing']['city'] = req.body.city;
    if (req.body.state)     jsonBillingAddress['billing']['state'] = req.body.state;
    if (req.body.zipCode)   jsonBillingAddress['billing']['zip_code'] = req.body.zipCode;
    if (req.body.country)   jsonBillingAddress['billing']['country'] = req.body.country;

    const arrayBindParams = [];
    arrayBindParams.push(JSON.stringify(jsonBillingAddress));
    arrayBindParams.push(userid);
    const sqlStmtUpdateUser = `
    UPDATE sys.users
    SET json_address = JSON_MERGE_PATCH(IFNULL(json_address, '{}'), ?)
    WHERE userid = ?
      AND deleted = 'N'
    `;
    const jsonUpdateUserPromise = mySqlConnection.execMySql(sqlStmtUpdateUser, arrayBindParams);
    const jsonUpdateUserOutput = await jsonUpdateUserPromise;
    if (jsonUpdateUserOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to update billing address of user with id: ${userid}`, req, res);

    return jsonUpdateUserOutput;
}
apiArray.push(
    {
        method: 'PUT',
        handler: replyto_jsonUpdateUserBillingAddress,
        path: 'jsonUpdateUserBillingAddress',
        options:
        {
            public: true,
            description: 'Updates billing address of a Gpus4All user',
            group: 'User Profile Management',
            sampleParams:
            {
                "userid": "USR00001",
                "street1": "1234 Graphics St",
                "street2": "Apt #132",
                "city": "Graphics City",
                "state": "CA",
                "zipCode": "90123",
                "country": "USA",
            }
        }
    }
);

async function replyto_jsonUpdateUserAvatar(req, res)
{

}
apiArray.push(
    {
        method: 'PUT',
        handler: replyto_jsonUpdateUserAvatar,
        path: 'jsonUpdateUserAvatar',
        options:
        {
            public: true,
            description: 'Updates avatar of a Gpus4All user',
            group: 'User Profile Management',
            sampleParams:
            {
                "userid": "USR00001",
            }
        }
    }
);

async function replyto_jsonEditUserCreditCardInformation(req, res)
{
    if (req.body.uuid === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: uuid`, req, res);
    if (req.body.userid === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: userid`, req, res);
    if (req.body.expiration_month === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: expiration_month`, req, res);
    if (req.body.expiration_year === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: expiration_year`, req, res);
    if (req.body.is_primary === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: is_primary`, req, res);

    const uuid = req.body.uuid;
    const userid = req.body.userid;
    const expirationMonth = req.body.expiration_month;
    const expirationYear = req.body.expiration_year;
    const isPrimary = req.body.is_primary;

    // Validate credit card information
    if (expirationMonth.length === 0) return gpusGeneral.buildJsonErrorMessage(`Expiration month is empty`, req, res);
    if (expirationMonth.length != 2) return gpusGeneral.buildJsonErrorMessage(`Expiration month must be 2 letters`, req, res);
    const cardExpirationMonthRegex = /(0[1-9]|1[0-2])/;
    if (!cardExpirationMonthRegex.test(expirationMonth)) return gpusGeneral.buildJsonErrorMessage(`Expiration month is invalid`, req, res);
    if (expirationYear.length === 0) return gpusGeneral.buildJsonErrorMessage(`Expiration year is empty`, req, res);
    if (expirationYear.length != 4) return gpusGeneral.buildJsonErrorMessage(`Expiration year must be 4 numbers`, req, res);
    const cardExpirationYearRegex = /[0-9]{4}/;
    if (!cardExpirationYearRegex.test(expirationYear)) return gpusGeneral.buildJsonErrorMessage(`Expiration year is invalid`, req, res);
    if (typeof isPrimary != 'boolean') return gpusGeneral.buildJsonErrorMessage(`isPrimary is invalid data type`, req, res);

    // Get existing card information
    const arrayBindParamsGetUser = [];
    arrayBindParamsGetUser.push(userid);
    const sqlStmtGetUser = `
    SELECT JSON_EXTRACT(json_user, '$.credit_cards') AS "credit_cards" 
    FROM sys.users
    WHERE userid = ?
      AND deleted = 'N'
    `;
    const jsonGetUserPromise = mySqlConnection.execMySql(sqlStmtGetUser, arrayBindParamsGetUser);
    const jsonGetUserOutput = await jsonGetUserPromise;
    if (jsonGetUserOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to get user with id: ${userid}`, req, res);
    if (jsonGetUserOutput['resultset'].length <= 0) return gpusGeneral.buildJsonErrorMessage(`Resultset when getting user with id: ${userid} was empty`, req, res);
    const jsonEntry = jsonGetUserOutput['resultset'][0];
    let jsonCreditCards = JSON.parse(jsonEntry['credit_cards']);
    if (jsonCreditCards == null) return gpusGeneral.buildJsonErrorMessage(`Credit card to edit does not exist for user with id: ${userid}`, req, res);
    if (!jsonCreditCards[uuid]) return gpusGeneral.buildJsonErrorMessage(`Credit card uuid to edit does not exist for user with id: ${userid}`, req, res);

    // Validate, extract, and decrypt
    const cardInfoHex = jsonCreditCards[uuid]['card_info'];
    const iv = cardInfoHex.slice(0, 32);
    const cipherText = cardInfoHex.slice(32);
    const decryptedCipherText = gpusGeneral.cryptoDecryptCardInfoAES(cipherText, iv);
    if (decryptedCipherText == null) return gpusGeneral.buildJsonErrorMessage(`Failed to decrypt card info for user with id ${userid}`, req, res);
    const jsonDecryptedCardInfo = JSON.parse(decryptedCipherText);
    jsonDecryptedCardInfo['expiration_month'] = expirationMonth;
    jsonDecryptedCardInfo['expiration_year'] = expirationYear;
    const stringifiedJsonUpdatedCard = JSON.stringify(jsonDecryptedCardInfo);

    // Generate new iv and encrypt
    const jsonGenerateivOutput = await gpusGeneral.cryptoRandomBytes(16);
    if (jsonGenerateivOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to generate iv for user with id ${userid}`, req, res);
    if (jsonGenerateivOutput['status'].length <= 0) return gpusGeneral.buildJsonErrorMessage(`Failed to generate iv for user with id ${userid} because resultset was empty`, req, res);
    const ivBufferNew = jsonGenerateivOutput['resultset'][0]['buf'];
    const ivNew = ivBufferNew.toString('hex');
    const encryptedInfoNew = gpusGeneral.cryptoEncryptCardInfoAES(stringifiedJsonUpdatedCard, ivNew);
    if (encryptedInfoNew == null) return gpusGeneral.buildJsonErrorMessage(`Failed to encrypt card info for user with id ${userid}`, req, res);
    const encryptedCardInfoNew = ivNew + encryptedInfoNew;

    // Create new uuid and add new card info
    jsonCreditCards[uuid]['card_info'] = encryptedCardInfoNew;
    jsonCreditCards[uuid]['is_primary'] = isPrimary;
    if (isPrimary == true)
    {
        for (const [k, v] in Object.entries(jsonCreditCards))
        {
            if (k === uuid) continue;
            v['is_primary'] = false;
        }
    }
    const stringifiedCreditCards = JSON.stringify(jsonCreditCards);

    // Update card information
    const arrayBindParams = [];
    arrayBindParams.push(stringifiedCreditCards);
    arrayBindParams.push(userid);
    const sqlStmtUpdateUser = `
    UPDATE sys.users
    SET json_user = JSON_SET(IFNULL(json_user, '{}'), '$.credit_cards', ?)
    WHERE userid = ?
      AND deleted = 'N'
    `;
    const jsonUpdateUserPromise = mySqlConnection.execMySql(sqlStmtUpdateUser, arrayBindParams);
    const jsonUpdateUserOutput = await jsonUpdateUserPromise;
    if (jsonUpdateUserOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to update credit card information for user with id: ${userid}`, req, res);

    return jsonUpdateUserOutput;
}
apiArray.push(
    {
        method: 'PUT',
        handler: replyto_jsonEditUserCreditCardInformation,
        path: 'jsonEditUserCreditCardInformation',
        options:
        {
            public: true,
            description: 'Edits existing credit card information of a Gpus4All user',
            group: 'User Profile Management',
            sampleParams:
            {
                "uuid": "1234-5678-1234-5678",
                "userid": "USR00001",
                "cardholder_name": "John Doe",
                "expiration_month": "09",
                "expiration_year": "2026",
                "is_primary": false,
            }
        }
    }
);

async function replyto_jsonAddUserCreditCardInformation(req, res)
{
    if (req.body.userid === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: userid`, req, res);
    if (req.body.cardholder_name === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: cardholder_name`, req, res);
    if (req.body.card_number === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: card_number`, req, res);
    if (req.body.expiration_month === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: expiration_month`, req, res);
    if (req.body.expiration_year === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: expiration_year`, req, res);
    if (req.body.is_primary === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: is_primary`, req, res);

    const userid = req.body.userid;
    const cardholderName = req.body.cardholder_name;
    const cardNumber = req.body.card_number;
    const expirationMonth = req.body.expiration_month;
    const expirationYear = req.body.expiration_year;
    const isPrimary = req.body.is_primary;

    // TODO: Validate network
    const network = 'Visa';

    // Validate credit card information
    if (cardholderName.length === 0) return gpusGeneral.buildJsonErrorMessage(`Cardholder name is empty`, req, res);
    if (cardholderName.length > 202) return gpusGeneral.buildJsonErrorMessage(`Cardholder name cannot be longer than 202 characters`, req, res);
    if (cardNumber.length === 0) return gpusGeneral.buildJsonErrorMessage(`Card number is empty`, req, res);
    if (cardNumber.length !== 16) return gpusGeneral.buildJsonErrorMessage(`Card number must be 16 numbers`, req, res);
    const cardNumberRegex = /[0-9]{16}/;
    if (!cardNumberRegex.test(cardNumber)) return gpusGeneral.buildJsonErrorMessage(`Card number is invalid`, req, res);
    if (expirationMonth.length === 0) return gpusGeneral.buildJsonErrorMessage(`Expiration month is empty`, req, res);
    if (expirationMonth.length != 2) return gpusGeneral.buildJsonErrorMessage(`Expiration month must be 2 letters`, req, res);
    const cardExpirationMonthRegex = /(0[1-9]|1[0-2])/;
    if (!cardExpirationMonthRegex.test(expirationMonth)) return gpusGeneral.buildJsonErrorMessage(`Expiration month is invalid`, req, res);
    if (expirationYear.length === 0) return gpusGeneral.buildJsonErrorMessage(`Expiration year is empty`, req, res);
    if (expirationYear.length != 4) return gpusGeneral.buildJsonErrorMessage(`Expiration year must be 4 numbers`, req, res);
    const cardExpirationYearRegex = /[0-9]{4}/;
    if (!cardExpirationYearRegex.test(expirationYear)) return gpusGeneral.buildJsonErrorMessage(`Expiration year is invalid`, req, res);
    if (typeof isPrimary != 'boolean') return gpusGeneral.buildJsonErrorMessage(`isPrimary is invalid data type`, req, res);

    // Get existing card information
    const arrayBindParamsGetUser = [];
    arrayBindParamsGetUser.push(userid);
    const sqlStmtGetUser = `
    SELECT JSON_EXTRACT(json_user, '$.credit_cards') AS "credit_cards" 
    FROM sys.users
    WHERE userid = ?
      AND deleted = 'N'
    `;
    const jsonGetUserPromise = mySqlConnection.execMySql(sqlStmtGetUser, arrayBindParamsGetUser);
    const jsonGetUserOutput = await jsonGetUserPromise;
    if (jsonGetUserOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to get user's credit card info with id: ${userid}`, req, res);
    if (jsonGetUserOutput['resultset'].length <= 0) return gpusGeneral.buildJsonErrorMessage(`Resultset when getting credit card info for user with id: ${userid} was empty`, req, res);
    const jsonEntry = jsonGetUserOutput['resultset'][0];
    let jsonCreditCards = JSON.parse(jsonEntry['credit_cards']);
    if (jsonCreditCards == null) jsonCreditCards = {};

    // Prepare credit card json
    const jsonNewCard = {};
    jsonNewCard['network'] = network;
    jsonNewCard['cardholder_name'] = cardholderName;
    jsonNewCard['card_number'] = cardNumber;
    jsonNewCard['expiration_month'] = expirationMonth;
    jsonNewCard['expiration_year'] = expirationYear;
    const stringifiedJsonNewCard = JSON.stringify(jsonNewCard);

    // Generate new iv and encrypt
    const jsonGenerateivOutput = await gpusGeneral.cryptoRandomBytes(16);
    if (jsonGenerateivOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to generate iv for user with id ${userid}`, req, res);
    if (jsonGenerateivOutput['status'].length <= 0) return gpusGeneral.buildJsonErrorMessage(`Failed to generate iv for user with id ${userid} because resultset was empty`, req, res);
    const ivBufferNew = jsonGenerateivOutput['resultset'][0]['buf'];
    const ivNew = ivBufferNew.toString('hex');
    const encryptedInfoNew = gpusGeneral.cryptoEncryptCardInfoAES(stringifiedJsonNewCard, ivNew);
    if (encryptedInfoNew == null) return gpusGeneral.buildJsonErrorMessage(`Failed to encrypt card info for user with id ${userid}`, req, res);
    const encryptedCardInfoNew = ivNew + encryptedInfoNew;

    // Create new uuid and add new card info
    const uuid = gpusGeneral.cryptoGenerateUUID();
    jsonCreditCards[uuid] = {};
    jsonCreditCards[uuid]['card_info'] = encryptedCardInfoNew;
    jsonCreditCards[uuid]['is_primary'] = isPrimary;
    if (isPrimary == true)
    {
        for (const [k, v] in Object.entries(jsonCreditCards))
        {
            if (k === uuid) continue;
            v['is_primary'] = false;
        }
    }
    const stringifiedCreditCards = JSON.stringify(jsonCreditCards);
    console.log('Final form json');
    console.log(stringifiedCreditCards);

    // Update card information
    const arrayBindParams = [];
    arrayBindParams.push(stringifiedCreditCards);
    arrayBindParams.push(userid);
    const sqlStmtUpdateUser = `
    UPDATE sys.users
    SET json_user = JSON_SET(IFNULL(json_user, '{}'), '$.credit_cards', ?)
    WHERE userid = ?
      AND deleted = 'N'
    `;
    const jsonUpdateUserPromise = mySqlConnection.execMySql(sqlStmtUpdateUser, arrayBindParams);
    const jsonUpdateUserOutput = await jsonUpdateUserPromise;
    if (jsonUpdateUserOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to add credit card information for user with id: ${userid}`, req, res);

    return jsonUpdateUserOutput;
}
apiArray.push(
    {
        method: 'PUT',
        handler: replyto_jsonAddUserCreditCardInformation,
        path: 'jsonAddUserCreditCardInformation',
        options:
        {
            public: true,
            description: 'Adds new credit card information of a Gpus4All user',
            group: 'User Profile Management',
            sampleParams:
            {
                "userid": "USR00001",
                "cardholder_name": "John Doe",
                "card_number": "1234567812345678",
                "expiration_month": "12",
                "expiration_year": "2025",
                "is_primary": false,
            }
        }
    }
);

async function replyto_jsonDisableUserAccount(req, res)
{
    if (req.body.userid === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: userid`, req, res);

    const userid = req.body.userid;

    const arrayBindParams = [];
    arrayBindParams.push(userid);
    const sqlStmtUpdateUser = `
    UPDATE sys.users
    SET deleted = 'Y'
    WHERE userid = ?
      AND deleted = 'N'
    `;
    const jsonUpdateUserPromise = mySqlConnection.execMySql(sqlStmtUpdateUser, arrayBindParams);
    const jsonUpdateUserOutput = await jsonUpdateUserPromise;
    if (jsonUpdateUserOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to delete user with id: ${userid}`, req, res);

    return jsonUpdateUserOutput;
}
apiArray.push(
    {
        method: 'PUT',
        handler: replyto_jsonDisableUserAccount,
        path: 'jsonDisableUserAccount',
        options:
        {
            public: true,
            description: 'Disable account of a Gpus4All user',
            group: 'User Profile Management',
            sampleParams:
            {
                "userid": "USR00001",
            }
        }
    }
);
