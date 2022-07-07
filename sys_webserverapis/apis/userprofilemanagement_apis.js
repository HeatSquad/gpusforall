const mySqlConnection = require('../../shared_server/wrappers_mysql.js');
const gpusGeneral = require('../../shared_server/general.js');

const apiArray = [];
module.exports = apiArray;

async function replyto_jsonCreateNewUser(req, res)
{
    if (req.body.username === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: username`, req, res);
    if (req.body.password === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: password`, req, res);
    if (req.body.email === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: email`, req, res);
    if (req.body.first_name === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: first_name`, req, res);
    if (req.body.last_name === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: last_name`, req, res);
    if (req.body.dob === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: dob`, req, res);

    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const dob = req.body.dob;

    // Validate inputs
    if (username.length <= 0) gpusGeneral.buildJsonErrorMessage(`Username is empty`, req, res);
    if (username.length > 30) gpusGeneral.buildJsonErrorMessage(`Username cannot be longer than 30 characters`, req, res);
    if (password.length <= 0) gpusGeneral.buildJsonErrorMessage(`Password is empty`, req, res);
    if (password.length < 12) gpusGeneral.buildJsonErrorMessage(`Password must be at least 12 characters`, req, res);
    if (password.length > 100) gpusGeneral.buildJsonErrorMessage(`Password cannot be longer than 100 characters`, req, res);
    if (email.length <= 0) gpusGeneral.buildJsonErrorMessage(`Email is empty`, req, res);
    if (email.length > 320) gpusGeneral.buildJsonErrorMessage(`Email cannot be longer than 320 characters`, req, res);
    if (firstName.length <= 0) gpusGeneral.buildJsonErrorMessage(`First name is empty`, req, res);
    if (firstName.length > 100) gpusGeneral.buildJsonErrorMessage(`First name cannot be longer than 100 characters`, req, res);
    if (lastName.length <= 0) gpusGeneral.buildJsonErrorMessage(`Last name is empty`, req, res);
    if (lastName.length > 100) gpusGeneral.buildJsonErrorMessage(`Last name cannot be longer than 100 characters`, req, res);
    if (dob.length <= 0) return gpusGeneral.buildJsonErrorMessage(`Date of Birth is empty`);
    if (dob.length > 10) return gpusGeneral.buildJsonErrorMessage(`Date of Birth cannot be longer than 10 characters`);
    const dobRegex = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
    if (!dobRegex.test(dob)) return gpusGeneral.buildJsonErrorMessage(`Date of Birth is an invalid format`);

    // Encrypt password
    const jsonGenerateSaltOutput = await gpusGeneral.cryptoRandomBytes(32);
    if (jsonGenerateSaltOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to generate salt`, req, res);
    if (jsonGenerateSaltOutput['status'].length <= 0) return gpusGeneral.buildJsonErrorMessage(`Failed to generate salt because resultset was empty`, req, res);
    const saltBuffer = jsonGenerateSaltOutput['resultset'][0]['buf'];
    const salt = saltBuffer.toString('hex');

    const encryptedPassword = gpusGeneral.cryptoHashMessage256Bit(password, salt);
    if (encryptedPassword == null) return gpusGeneral.buildJsonErrorMessage(`Salt is incorrect length`, req, res);

    const arrayBindParams = [];
    arrayBindParams.push(username);
    arrayBindParams.push(email);
    arrayBindParams.push(firstName);
    arrayBindParams.push(lastName);
    arrayBindParams.push(dob);
    arrayBindParams.push(encryptedPassword);
    arrayBindParams.push(salt);
    arrayBindParams.push(username);
    const sqlStmtCreateUser = `
    INSERT INTO sys.users (username, email, first_name, last_name, dob, password, salt, modified_by)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const jsonCreateUserPromise = mySqlConnection.execMySql(sqlStmtCreateUser, arrayBindParams);
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
