import gpusGeneral from '../../shared/general.js';
import axios from 'axios';

export default 
{
    methods: {
        performHttpRequest: async function(apiEndpoint, params, method)
        {
            if (/^\//.test(apiEndpoint) == false) return gpusGeneral.replywith_jsonErrorMessage(`ERROR: apiEndpoint format is invalid`);
            if (typeof method != 'string') return gpusGeneral.replywith_jsonErrorMessage(`ERROR: method is an invalid datatype`);
            if (params && typeof params != 'object') return gpusGeneral.replywith_jsonErrorMessage(`ERROR: params is an invalid datatype`);

            const processedMethod = method.trim().toUpperCase();
            const arrayOfValidMethods = ['GET', 'POST', 'PUT'];
            if (!arrayOfValidMethods.includes(processedMethod)) return gpusGeneral.replywith_jsonErrorMessage(`ERROR: method is not allowed`);

            const axiosInstance = axios.create({
                baseURL: 'http://localhost:3000/apis',
                timeout: 10000,
            });
            let httpResponse = null;
            if (processedMethod === 'GET')
            {
                try {
                    httpResponse = await axiosInstance.get(apiEndpoint);
                } catch (error) {
                    return gpusGeneral.replywith_jsonErrorMessage(error);
                }
            }
            else if (processedMethod === 'POST')
            {
                try {
                    httpResponse = await axiosInstance.post(apiEndpoint, params);
                } catch (error) {
                    return gpusGeneral.replywith_jsonErrorMessage(error);
                }
            }
            else if (processedMethod === 'PUT')
            {
                try {
                    httpResponse = await axiosInstance.put(apiEndpoint, params);
                } catch (error) {
                    return gpusGeneral.replywith_jsonErrorMessage(error);
                }
            }

            if (!httpResponse['status']) return gpusGeneral.replywith_jsonErrorMessage(`ERROR: http response status does not exist`);
            if (!httpResponse['data']) return gpusGeneral.replywith_jsonErrorMessage(`ERROR: http response data does not exist`);

            const statusCode = httpResponse['status'];
            const responseBody = httpResponse['data'];
            // TODO: Status Code error handling
            if (statusCode < 200 || statusCode > 299) return gpusGeneral.replywith_jsonErrorMessage(`ERROR: The http request failed`);
            return responseBody;
        },
        performGetHttpRequest: async function(apiEndpoint)
        {
            console.log(apiEndpoint);
            return this.performHttpRequest(apiEndpoint, null, 'GET');
        },
        performPostHttpRequest: async function(apiEndpoint, params)
        {
            console.log(apiEndpoint);
            return this.performHttpRequest(apiEndpoint, params, 'POST');
        },
        performPutHttpRequest: async function(apiEndpoint, params)
        {
            console.log(apiEndpoint);
            return this.performHttpRequest(apiEndpoint, params, 'PUT');
        },
    }
}