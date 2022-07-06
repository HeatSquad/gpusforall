function replywith_jsonInvalidParameters(message)
{
    const jsonResult = {};
    jsonResult['status'] = 'ERROR';
    jsonResult['message'] = `Invalid Parameter(s)! ${message}`;
    jsonResult['resultset'] = [];
    return jsonResult;
}

function replywith_jsonErrorMessage(message)
{
    const jsonResult = {};
    jsonResult['status'] = 'ERROR';
    jsonResult['message'] = message;
    jsonResult['resultset'] = [];
    return jsonResult;
}

function replywith_jsonSuccessMessage(message, resultset = [])
{
    const jsonResult = {};
    jsonResult['status'] = 'SUCCESS';
    jsonResult['message'] = message;
    jsonResult['resultset'] = resultset;
    return jsonResult;
}

module.exports =
{
    replywith_jsonInvalidParameters: replywith_jsonInvalidParameters,
    replywith_jsonErrorMessage: replywith_jsonErrorMessage,
    replywith_jsonSuccessMessage: replywith_jsonSuccessMessage,
};