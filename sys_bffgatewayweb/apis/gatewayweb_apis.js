const mySqlConnection = require('../../shared_server/wrappers_mysql.js');
const gpusGeneral = require('../../shared_server/general.js');

const apiArray = [];
module.exports = apiArray;

/**
 * Entrypoint api for requests to be forward to the correct services.
 * (1) Get service registry from cache, return error if fail (downtime)
 * (2) Parse incoming api_endpoint. If there is an api group, the endpoint should include that in its value
 *     api_endpoint format: /<service>/[<apiGroup>/]<apiName>
 * (3) If service from parse result is not in the cache, return error
 * (4) Get ip address and port # of specific service
 * (5) Construct complete path
 *     <hostName>:<port#>/<baseURL>/<service>/[<apiGroup>/]<apiUrl>
 * (6) Forward request
 */
async function replyto_jsonApiGateway(req, res)
{
    if (req.body.api_endpoint === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: api_endpoint`, req, res);
    if (req.body.api_method === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: api_method`, req, res);

    const apisBaseUrl = process.env.APIS_BASE_URL;
    const apiEndpoint = req.body.api_endpoint;
    const apiMethod = req.body.api_method;

    if (!apisBaseUrl.startsWith('/')) return gpusGeneral.buildJsonErrorMessage(`apis base url format is invalid`, req, res);
    if (!apiEndpoint.startsWith('/')) return gpusGeneral.buildJsonErrorMessage(`api endpoint format is invalid`, req, res);

    // Get service registry from cache
    // TODO: Replace with redis -----------------------------------------------
    const arrayBindParamsFetchRegistry = [];
    const sqlStmtFetchRegistry = `
    SELECT pm_id,
           name,
           service_path,
           pid,
           instances,
           ipaddress,
           subnet_mask,
           port,
           json_process,
           status,
           created,
           modified
    FROM sys.registry
    WHERE status = 'online'
    `;
    const jsonFetchRegistryPromise = mySqlConnection.execMySql(sqlStmtFetchRegistry, arrayBindParamsFetchRegistry);
    const jsonFetchRegistryOutput = await jsonFetchRegistryPromise;
    if (jsonFetchRegistryOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to fetch registry`, req, res);
    if (jsonFetchRegistryOutput['resultset'].length <= 0) return gpusGeneral.buildJsonErrorMessage(`Resultset when fetching registry was empty`, req, res);
    // ------------------------------------------------------------------------

    // Parse the incoming api_endpoint.
    const formattedApiEndpoint = apiEndpoint.slice(1);
    const [servicePath, ...arrayApiName] = formattedApiEndpoint.split('/');

    // Validate that service is in cache
    const resultsetRegistry = jsonFetchRegistryOutput['resultset'];
    const arrayRequestedService = resultsetRegistry.filter((jsonInstance) => {
        return jsonInstance['service_path'] === servicePath;
    });
    if (arrayRequestedService.length <= 0) return gpusGeneral.buildJsonErrorMessage(`Failed to find requested service`, req, res);
    const jsonRequestedService = arrayRequestedService[0];

    // Construct the complete path
    let protocol = null; 
    if (process.env.NODE_ENV === 'development') protocol = 'http://';
    if (process.env.NODE_ENV === 'production') protocol = 'https://';
    if (protocol == null) return gpusGeneral.buildJsonErrorMessage(`Failed to determine protocol`);

    const hostName = jsonRequestedService['ipaddress'];
    const port = jsonRequestedService['port'];
    const host = `${protocol}${hostName}:${port}`;
    const completeBaseUrl = host + apisBaseUrl;
    const completePathName = '/' + [servicePath, ...arrayApiName].join('/');
    
    // Forward request to the correct service
    let httpResponseIntNetwork = null;
    if (apiMethod === 'GET')    httpResponseIntNetwork = await gpusGeneral.performGetHttpRequest(completeBaseUrl, completePathName);
    if (apiMethod === 'POST')   httpResponseIntNetwork = await gpusGeneral.performPostHttpRequest(completeBaseUrl, completePathName, req.body.api_params);
    if (apiMethod === 'PUT')    httpResponseIntNetwork = await gpusGeneral.performPutHttpRequest(completeBaseUrl, completePathName, req.body.api_params);
    if (httpResponseIntNetwork == null ) return gpusGeneral.buildJsonErrorMessage(`Gateway failed to perform proxy request`, req, res);

    return httpResponseIntNetwork;
}
apiArray.push(
    {
        method: 'POST',
        handler: replyto_jsonApiGateway,
        path: 'jsonApiGateway',
        options:
        {
            public: true,
            description: 'Evaluate, process, and route the request through the API Gateway, which acts as the a reverse proxy',
            group: 'Gateway Web',
            sampleParams: {}
        }
    }
);