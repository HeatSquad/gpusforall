const axios = require('axios').default;

async function performHttpRequest(baseUrl, apiEndpoint, params, method)
{
    if (/^\//.test(apiEndpoint) == false) return buildJsonErrorMessage(`ERROR: apiEndpoint format is invalid`);
    if (typeof method != 'string') return buildJsonErrorMessage(`ERROR: method is an invalid datatype`);
    if (params && typeof params != 'object') return buildJsonErrorMessage(`ERROR: params is an invalid datatype`);

    const processedMethod = method.trim().toUpperCase();
    const arrayOfValidMethods = ['GET', 'POST', 'PUT'];
    if (!arrayOfValidMethods.includes(processedMethod)) return buildJsonErrorMessage(`ERROR: method is not allowed`);

    const axiosInstance = axios.create({
        baseURL: baseUrl,
        timeout: 10000,
    });
    let httpResponse = null;
    try {
        if (processedMethod === 'GET') httpResponse = await axiosInstance.get(apiEndpoint);
        else if (processedMethod === 'POST') httpResponse = await axiosInstance.post(apiEndpoint, params);
        else if (processedMethod === 'PUT') httpResponse = await axiosInstance.put(apiEndpoint, params);
    } catch (error) {
        return buildJsonErrorMessage(error);
    }

    if (!httpResponse['status']) return buildJsonErrorMessage(`ERROR: http response status does not exist`);
    if (!httpResponse['data']) return buildJsonErrorMessage(`ERROR: http response data does not exist`);

    const statusCode = httpResponse['status'];
    const responseBody = httpResponse['data'];
    // TODO: Status Code error handling
    if (statusCode < 200 || statusCode > 299) return buildJsonErrorMessage(`ERROR: The http request failed`);
    return responseBody;
}
async function performGetHttpRequest(baseUrl, apiEndpoint)
{
    console.log(apiEndpoint);
    return performHttpRequest(baseUrl, apiEndpoint, null, 'GET');
}
async function performPostHttpRequest(baseUrl, apiEndpoint, params)
{
    console.log(apiEndpoint);
    return performHttpRequest(baseUrl, apiEndpoint, params, 'POST');
}
async function performPutHttpRequest(baseUrl, apiEndpoint, params)
{
    console.log(apiEndpoint);
    return performHttpRequest(baseUrl, apiEndpoint, params, 'PUT');
}

function buildJsonErrorMessage(message)
{
    const jsonResult = {};
    jsonResult['status'] = 'ERROR';
    jsonResult['message'] = message;
    jsonResult['resultset'] = [];
    return jsonResult;
}

module.exports =
{
    performGetHttpRequest: performGetHttpRequest,
    performPostHttpRequest: performPostHttpRequest,
    performPutHttpRequest: performPutHttpRequest,
};