/**
 * Note: Wrapper functions here don't follow the resultset in json response,
 * instead it is just result (null if error)
 */
const redis = require('redis');
const { RedisCacheError } = require('./helpers_error/error_rediscache.js');
let client = null;
let totalRetryAttempts = 0;
const maxRetryAttemptsAllowed = 10;

async function initializeRedisClient(config)
{
    const host = config['host'];
    const port = config['port'];
    const password = config['password'];

    if (host === undefined) return RedisCacheError.buildJsonError('HOST_UNDEFINED');
    if (port === undefined) return RedisCacheError.buildJsonError('PORT_UNDEFINED');
    if (password === undefined) return RedisCacheError.buildJsonError('PASSWORD_UNDEFINED');

    const redisConfig =
    {
        socket:
        {
            host: host,
            port: port,
            reconnectStrategy: function(retries)
            {
                totalRetryAttempts = retries;
                if (retries > maxRetryAttemptsAllowed) return new Error("Retry attempts exhausted. Closing client and flushing command queues...");
                 return Math.min(retries * 300, 3000);
            }
        },
        // password: password
    }
    client = await redis.createClient(redisConfig);
    client.on('connect', function() {
        console.log('Cache: client is connected');
    });
    client.on('end', function() {
        console.log('Cache: client is disconnected');
    });
    client.on('reconnecting', function() {
        console.log('Cache: client is reconnecting');
        console.log(`Total attempts: ${totalRetryAttempts}`);
    });
    client.on('error', function(err) {
        console.error('Cache: client has errored.', err);
    });
}

async function connectRedis()
{
    if (client == null) return RedisCacheError.buildJsonError('ACTIVE_CLIENT_NOT_FOUND');
    return await client.connect();
}

async function endRedisConnection()
{
    if (client == null) return RedisCacheError.buildJsonError('ACTIVE_CLIENT_NOT_FOUND');
    return await client.quit();
}

// ============================================================================
// Redis String Operations
// ============================================================================
async function redisSetAsync(key, value)
{
    const jsonResult = {};
    jsonResult['status'] = 'ERROR';
    jsonResult['message'] = '';
    jsonResult['result'] = null;

    try {
        const redisSetResponse = await client.set(key, value);
        if (redisSetResponse != "OK")
        {
            jsonResult['message'] = `Failed to set value ${value} for key ${key}`;
            return jsonResult;
        }
        jsonResult['status'] = 'SUCCESS';
        jsonResult['result'] = redisSetResponse;
        return jsonResult;
    } catch (err) {
        jsonResult['message'] = err.message;
        return jsonResult;
    }
}
async function redisGetAsync(key)
{
    const jsonResult = {};
    jsonResult['status'] = 'ERROR';
    jsonResult['message'] = '';
    jsonResult['result'] = null;

    try {
        const redisGetResponse = await client.get(key);
        jsonResult['status'] = 'SUCCESS';
        jsonResult['result'] = redisGetResponse;
        return jsonResult;
    } catch (err) {
        jsonResult['message'] = err.message;
        return jsonResult;
    }
}
async function redisDelAsync(key)
{
    const jsonResult = {};
    jsonResult['status'] = 'ERROR';
    jsonResult['message'] = '';
    jsonResult['result'] = null;

    try {
        const redisDelResponse = await client.del(key);
        if (redisDelResponse <= 0)
        {
            jsonResult['message'] = `Failed to delete key ${key}`;
            return jsonResult;
        }
        jsonResult['status'] = 'SUCCESS';
        jsonResult['result'] = redisDelResponse;
        return jsonResult;
    } catch (err) {
        jsonResult['message'] = err.message;
        return jsonResult;
    }
}
async function redisExistsAsync(key)
{
    const jsonResult = {};
    jsonResult['status'] = 'ERROR';
    jsonResult['message'] = '';
    jsonResult['result'] = null;

    try {
        const redisExistsResponse = await client.exists(key);
        let doesKeyExist = redisExistsResponse > 0;

        jsonResult['status'] = 'SUCCESS';
        jsonResult['result'] = doesKeyExist;
        return jsonResult;
    } catch (err) {
        jsonResult['message'] = err.message;
        return jsonResult;
    }
}

// ============================================================================
// Redis String with Expiration Operations
// ============================================================================
async function redisSetExAsync(key, seconds, value)
{
    const jsonResult = {};
    jsonResult['status'] = 'ERROR';
    jsonResult['message'] = '';
    jsonResult['result'] = null;

    try {
        const redisSetExResponse = await client.setEx(key, seconds, value);
        if (redisSetExResponse != "OK")
        {
            jsonResult['message'] = `Failed to set value ${value} for key ${key}, expiring in ${seconds}s`;
            return jsonResult;
        }
        jsonResult['status'] = 'SUCCESS';
        jsonResult['result'] = redisSetExResponse;
        return jsonResult;
    } catch (err) {
        jsonResult['message'] = err.message;
        return jsonResult;
    }
}
async function redisTtlAsync(key)
{
    const jsonResult = {};
    jsonResult['status'] = 'ERROR';
    jsonResult['message'] = '';
    jsonResult['result'] = null;

    try {
        const redisTtlResponse = await client.ttl(key);
        if (redisTtlResponse === -2)
        {
            jsonResult['message'] = `key ${key} doesn't exist`;
            return jsonResult;
        }
        if (redisTtlResponse === -1)
        {
            jsonResult['message'] = `key ${key} exists but has no associated expire`;
            return jsonResult;
        }

        jsonResult['status'] = 'SUCCESS';
        jsonResult['result'] = redisTtlResponse;
        return jsonResult;
    } catch (err) {
        jsonResult['message'] = err.message;
        return jsonResult;
    }
}

// ============================================================================
// Redis Hash Operations
// ============================================================================
async function redisHSetAsync(key, hash) // TODO check if this actually works
{
    const jsonResult = {};
    jsonResult['status'] = 'ERROR';
    jsonResult['message'] = '';
    jsonResult['result'] = null;

    try {
        const redisHSetResponse = await client.hSet(key, hash);
        jsonResult['status'] = 'SUCCESS';
        jsonResult['result'] = redisHSetResponse;
        return jsonResult;
    } catch (err) {
        jsonResult['message'] = err.message;
        return jsonResult;
    }
}
async function redisHGetAllAsync(key)
{
    const jsonResult = {};
    jsonResult['status'] = 'ERROR';
    jsonResult['message'] = '';
    jsonResult['result'] = null;

    try {
        const redisHGetAllResponse = await client.hGetAll(key);
        jsonResult['status'] = 'SUCCESS';
        jsonResult['result'] = redisHGetAllResponse;
        return jsonResult;
    } catch (err) {
        jsonResult['message'] = err.message;
        return jsonResult;
    }
}
async function redisHGetAsync(key, field)
{
    const jsonResult = {};
    jsonResult['status'] = 'ERROR';
    jsonResult['message'] = '';
    jsonResult['result'] = null;

    try {
        const redisHGetResponse = await client.hGet(key, field);
        if (redisHGetResponse == null)
        {
            jsonResult['message'] = `Failed to get value for key ${key}, field ${field} in hash`;
            return jsonResult;
        }

        jsonResult['status'] = 'SUCCESS';
        jsonResult['result'] = redisHGetResponse;
        return jsonResult;
    } catch (err) {
        jsonResult['message'] = err.message;
        return jsonResult;
    }
}
async function redisHDelAsync(key, field)
{
    const jsonResult = {};
    jsonResult['status'] = 'ERROR';
    jsonResult['message'] = '';
    jsonResult['result'] = null;

    try {
        const redisHDelResponse = await client.hDel(key, field);
        if (redisHDelResponse <= 0)
        {
            jsonResult['message'] = `Failed to delete key ${key} in hash`;
            return jsonResult;
        }
        jsonResult['status'] = 'SUCCESS';
        jsonResult['result'] = redisHDelResponse;
        return jsonResult;
    } catch (err) {
        jsonResult['message'] = err.message;
        return jsonResult;
    }
}
async function redisHExistsAsync(key, field)
{
    const jsonResult = {};
    jsonResult['status'] = 'ERROR';
    jsonResult['message'] = '';
    jsonResult['result'] = null;

    try {
        const redisHExistsResponse = await client.exists(key, field);
        let doesKeyExist = redisHExistsResponse > 0;

        jsonResult['status'] = 'SUCCESS';
        jsonResult['result'] = doesKeyExist;
        return jsonResult;
    } catch (err) {
        jsonResult['message'] = err.message;
        return jsonResult;
    }
}

module.exports = 
{
    initializeRedisClient: initializeRedisClient,
    connectRedis: connectRedis,
    endRedisConnection: endRedisConnection,
    redisSetAsync: redisSetAsync,
    redisGetAsync: redisGetAsync,
    redisDelAsync: redisDelAsync,
    redisExistsAsync: redisExistsAsync,
    redisSetExAsync: redisSetExAsync,
    redisTtlAsync: redisTtlAsync,
    redisHSetAsync: redisHSetAsync,
    redisHGetAllAsync: redisHGetAllAsync,
    redisHGetAsync: redisHGetAsync,
    redisHDelAsync: redisHDelAsync,
    redisHExistsAsync: redisHExistsAsync,
};