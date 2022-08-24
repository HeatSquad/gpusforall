const redisCache = require('../wrappers_redis.js');
const ecosystemDev = require('../../config/ecosystem_dev.json');
const ecosystemProd = require('../../config/ecosystem_prod.json');
const { CacheRegistryAdapterError } = require('../helpers_error/error_adapters_cache_registry.js');

/**
 * Note: For services that doesn't have an api layer (e.g. only serves statics), service_paths will be equal to ''
 * so the root key will be saved under registry/
 * Example schema
 * {
 *     registry/<service_path>:
 *     {
 *         <pm_id>: "{\"pm_id\":1,\"service_path\":\"services\",...}"
 *         <pm_id>: "{\"pm_id\":2,\"service_path\":\"services\",...}"
 *     },
 *     registry/<service_path>:
 *     {
 *         <pm_id>: "{\"pm_id\":3,\"service_path\":\"auth\",...}"
 *     }, ...
 * }
 */
const baseKey = 'registry';

function getListDeclaredCacheKeys()
{
    let jsonApps = null;
    if (process.env.NODE_ENV === 'development') jsonApps = ecosystemDev;
    if (process.env.NODE_ENV === 'production') jsonApps = ecosystemProd;
    if (jsonApps == null) return CacheRegistryAdapterError.buildJsonError(`ECOSYSTEM_NOT_FOUND`);
    const apps = jsonApps['apps'];
    
    // Get all service paths
    const arrayDeclaredCacheKeys = apps.filter((service) => {
        if (service['name'] === 'sys_procmanager' || service['name'] === 'sys_webserver') return false;
        return true;
    }).map((service) => {
        const servicePath = service['env']['SERVICE_PATH'];
        return [baseKey, servicePath].join('/');
    });

    return { status: 'SUCCESS', message: 'Retrieved declared cache keys', result: arrayDeclaredCacheKeys };
}
function getServicePaths()
{
    let jsonApps = null;
    if (process.env.NODE_ENV === 'development') jsonApps = ecosystemDev;
    if (process.env.NODE_ENV === 'production') jsonApps = ecosystemProd;
    if (jsonApps == null) return CacheRegistryAdapterError.buildJsonError(`ECOSYSTEM_NOT_FOUND`);
    const apps = jsonApps['apps'];
    
    // Get all service paths
    const arrayServicePaths = apps.filter((service) => {
        if (service['name'] === 'sys_procmanager' || service['name'] === 'sys_webserver') return false;
        return true;
    }).map((service) => {
        return service['env']['SERVICE_PATH'];
    });

    return { status: 'SUCCESS', message: 'Retrieved service paths', result: arrayServicePaths };
}

async function registerInstancesToCache(arrayInstances)
{
    const errorLog = [];
    const lookupMapServices = {};
    for (let i = 0; i < arrayInstances.length; i++)
    {
        const jsonInstance = arrayInstances[i];
        const pmId = jsonInstance['pm_id'];
        const servicePath = jsonInstance['service_path'];
        
        const rootKey = [baseKey, servicePath].join('/');
        if (lookupMapServices[rootKey] === undefined) lookupMapServices[rootKey] = {};
        lookupMapServices[rootKey][pmId] = JSON.stringify(jsonInstance);
    }
    for (const rootKey in lookupMapServices)
    {
        const hash = lookupMapServices[rootKey];
        const jsonSetHashCacheOutput = await redisCache.redisHSetAsync(rootKey, hash);
        if (jsonSetHashCacheOutput['status'] != 'SUCCESS')
        {
            errorLog.push({ error_type: 'HMSET_FAILED', error_msg_append: jsonSetHashCacheOutput['message']});
        }
    }

    if (errorLog.length > 0) return CacheRegistryAdapterError.buildJsonErrorLog(errorLog);
    return { status: 'SUCCESS', message: 'Registered instances to cache', result: null };
}

async function deregisterInstancesFromCache(arrayInstances)
{
    const errorLog = [];
    const lookupMapServices = {};
    for (let i = 0; i < arrayInstances.length; i++)
    {
        const jsonInstance = arrayInstances[i];
        const pmId = jsonInstance['pm_id'].toString();
        const servicePath = jsonInstance['service_path'];
        
        const rootKey = [baseKey, servicePath].join('/');
        const jsonFieldExistsOutput = await redisCache.redisHExistsAsync(rootKey, pmId);
        if (jsonFieldExistsOutput['status'] != 'SUCCESS')
        {
            errorLog.push({ error_type: 'HEXISTS_FAILED', error_msg_append: jsonFieldExistsOutput['message'] });
            continue;
        }
        if (jsonFieldExistsOutput['result'] === 0)
        {
            errorLog.push({ error_type: 'HEXISTS_FIELD_NOT_FOUND', error_msg_append: `Field ${pmId} for key ${rootKey} doesn't exist`});
            continue;
        }

        if (lookupMapServices[rootKey] === undefined) lookupMapServices[rootKey] = [];
        lookupMapServices[rootKey].push(pmId);
    }
    for (const rootKey in lookupMapServices)
    {
        const arrayFields = lookupMapServices[rootKey];
        for (const field of arrayFields)
        {
            const jsonDeleteFieldOutput = await redisCache.redisHDelAsync(rootKey, field);
            if (jsonDeleteFieldOutput['status'] != 'SUCCESS')
            {
                errorLog.push({ error_type: 'HDEL_FAILED', error_msg_append: jsonDeleteFieldOutput['message']});
                continue;
            }
            if (jsonDeleteFieldOutput['result'] === 0)
            {
                errorLog.push({ error_type: 'HDEL_UNEXPECTED_ERROR', error_msg_append: `Field ${field} was found to exist earlier, but deletion failed`});
            }
        }
    }
    if (errorLog.length > 0) return CacheRegistryAdapterError.buildJsonErrorLog(errorLog);
    return { status: 'SUCCESS', message: 'Deregistered instances from cache', result: null };
}

async function getAllInstancesFromCache(servicePath)
{
    const rootKey = [baseKey, servicePath].join('/');
    const jsonGetAllFieldsOutput = await redisCache.redisHGetAllAsync(rootKey);
    if (jsonGetAllFieldsOutput['status'] != 'SUCCESS') return CacheRegistryAdapterError.buildJsonError('HGETALL_FAILED');

    const jsonResult = jsonGetAllFieldsOutput['result'];
    for (const field in jsonResult)
    {
        const parsedJsonInstance = JSON.parse(jsonResult[field]);
        jsonResult[field] = parsedJsonInstance;
    }
    return { status: 'SUCCESS', message: 'Retrieved all instances from cache', result: jsonResult };
}

async function flushRegistry()
{
    // Get all service paths from ecosystem
    let jsonApps = null;
    if (process.env.NODE_ENV === 'development') jsonApps = ecosystemDev;
    if (process.env.NODE_ENV === 'production') jsonApps = ecosystemProd;
    if (jsonApps == null) return CacheRegistryAdapterError.buildJsonError(`ECOSYSTEM_NOT_FOUND`);
    const apps = jsonApps['apps'];

    // Get all service paths
    const arrayServicePaths = apps.filter((service) => {
        if (service['name'] === 'sys_procmanager' || service['name'] === 'sys_webserver') return false;
        return true;
    }).map((service) => {
        const servicePath = service['env']['SERVICE_PATH'];
        return [baseKey, servicePath].join('/');
    });

    // Delete each registry key
    const errorLog = [];
    for (const rootKey of arrayServicePaths)
    {
        const jsonDeleteKeyOutput = await redisCache.redisDelAsync(rootKey);
        if (jsonDeleteKeyOutput['status'] != 'SUCCESS')
        {
            errorLog.push({ error_type: 'DEL_FAILED', error_msg_append: jsonDeleteKeyOutput['message'] });
        }
    }

    if (errorLog > 0) return CacheRegistryAdapterError.buildJsonErrorLog(errorLog);
    return { status: 'SUCCESS', message: 'Flush registry completed', result: null };
}

module.exports =
{
    getListDeclaredCacheKeys: getListDeclaredCacheKeys,
    getServicePaths: getServicePaths,
    registerInstancesToCache: registerInstancesToCache,
    deregisterInstancesFromCache: deregisterInstancesFromCache,
    getAllInstancesFromCache: getAllInstancesFromCache,
    flushRegistry: flushRegistry,
}
