function replywith_jsonInvalidParameters(message, req, res)
{
    const jsonResult = {};
    jsonResult['status'] = 'ERROR';
    jsonResult['message'] = `Invalid Parameter(s)! ${message}`;
    jsonResult['resultset'] = [];
    return jsonResult;
}

function replywith_jsonErrorMessage(message, req, res)
{
    const jsonResult = {};
    jsonResult['status'] = 'ERROR';
    jsonResult['message'] = message;
    jsonResult['resultset'] = [];
    return jsonResult;
}

module.exports =
{
    replywith_jsonInvalidParameters: replywith_jsonInvalidParameters,
    replywith_jsonErrorMessage: replywith_jsonErrorMessage,
};