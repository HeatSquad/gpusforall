function buildJsonInvalidParameters(message)
{
    const jsonResult = {};
    jsonResult['status'] = 'ERROR';
    jsonResult['message'] = `Invalid Parameter(s)! ${message}`;
    jsonResult['resultset'] = [];
    return jsonResult;
}

function buildJsonErrorMessage(message)
{
    const jsonResult = {};
    jsonResult['status'] = 'ERROR';
    jsonResult['message'] = message;
    jsonResult['resultset'] = [];
    return jsonResult;
}

function buildJsonSuccessMessage(message, resultset)
{
    const jsonResult = {};
    jsonResult['status'] = 'SUCCESS';
    jsonResult['message'] = message;
    jsonResult['resultset'] = resultset;
    return jsonResult;
}

module.exports =
{
    buildJsonInvalidParameters: buildJsonInvalidParameters,
    buildJsonErrorMessage: buildJsonErrorMessage,
    buildJsonSuccessMessage: buildJsonSuccessMessage,
};