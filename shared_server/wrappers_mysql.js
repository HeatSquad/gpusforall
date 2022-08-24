const mysql = require('mysql2');
const { MySqlDbError } = require('./helpers_error/error_mysqldb.js');
const pool = {};

// ========================================================
// Connection Initialization, Execution, and Shutdown
// ========================================================
// Create the pool of connections
// Connections are lazily created by the pool.
// Connections are also cycled round-robin style
async function initializePool(configs)
{
    console.log('**************************************************');
    console.log('INITIALIZING MYSQL POOL');
    console.log('**************************************************');
    for (const dbName in configs)
    {
        console.log(`Initializing connection to MYSQL database [${dbName}]`);
        const dbConfig = configs[dbName];
        const host = dbConfig['host'];
        const port = dbConfig['port'];
        const user = dbConfig['user'];
        const password = dbConfig['password'];
        const database = dbConfig['database'];
        const connectionLimit = dbConfig['connectionLimit'];
        const queueLimit = dbConfig['queueLimit'];
        const waitForConnectionszzz = dbConfig['waitForConnections'];

        if (host === undefined) return MySqlDbError.buildJsonError('HOST_UNDEFINED');
        if (port === undefined) return MySqlDbError.buildJsonError('PORT_UNDEFINED');
        if (user === undefined) return MySqlDbError.buildJsonError('USER_UNDEFINED');
        if (password === undefined) return MySqlDbError.buildJsonError('PASSWORD_UNDEFINED');
        if (database === undefined) return MySqlDbError.buildJsonError('DATABASE_UNDEFINED');
        if (connectionLimit === undefined) return MySqlDbError.buildJsonError('CONNECTION_LIMIT_UNDEFINED');
        if (queueLimit === undefined) return MySqlDbError.buildJsonError('QUEUE_LIMIT_UNDEFINED');
        if (waitForConnectionszzz === undefined) return MySqlDbError.buildJsonError('WAIT_CONNECTIONS_UNDEFINED');

        pool[dbName] = await mysql.createPool(dbConfig);
        console.log(`Created pool for db [${dbName}]`);

        // Pool Events
        pool[dbName].on('acquire', function(connection)
        {
            console.log('Connection %d acquired', connection.threadId);
        });
        pool[dbName].on('connection', function(connection)
        {
            // connection.query('SET SESSION auto_increment_increment=1')
            console.log('Connection was made');
        });
        pool[dbName].on('enqueue', function ()
        {
            console.log('Waiting for available connection slot');
        });
        pool[dbName].on('release', function(connection)
        {
            console.log('Connection %d released', connection.threadId);
        });
    }
}

async function execMySql(sqlStmt, arrayBindParams, isWriting)
{
    const activeDbName = 'sys';
    if (!pool[activeDbName]) return MySqlDbError.buildJsonError('ACTIVE_DB_NOT_FOUND');

    const jsonResult = {};
    jsonResult['status'] = 'ERROR';
    jsonResult['message'] = '';
    jsonResult['resultset'] = [];

    return new Promise((resolve, reject) =>
    {
        pool[activeDbName].getConnection(function(errorConnection, connection) 
        {
            if (errorConnection != null) // not connected!
            {
                jsonResult['message'] = `Unable to obtain a connection! ${errorConnection}`;
                return reject(jsonResult);
            }
            if (connection == null)
            {
                jsonResult['message'] = `Connection does not exist!`;
                return reject(jsonResult);
            }
        
            if (arrayBindParams.length > 0)
            {
                const numExpectedPlaceholders = sqlStmt.split('?').length - 1;
                if (numExpectedPlaceholders != arrayBindParams.length)
                {
                    jsonResult['message'] = `Expected ${numExpectedPlaceholders} placeholders but found ${arrayBindParams.length}`;
                    return reject(jsonResult);
                }
            }
        
            // Use the connection
            const jsonConnectionOptions = {};
            jsonConnectionOptions['sql'] = sqlStmt;
            jsonConnectionOptions['timeout'] = 40000;
            jsonConnectionOptions['values'] = arrayBindParams;

            connection.query(jsonConnectionOptions, function (errorQuery, results, fields) {
                // When done with the connection, release it.
                connection.release();
            
                // Handle error after the release.
                if (errorQuery)
                {
                    console.log('ERROR');
                    console.log(errorQuery);
                    jsonResult['message'] = `Query failed to execute. ${errorQuery}`;
                    return reject(jsonResult);
                }
                if (results === undefined || results == null) results = [];

                jsonResult['status'] = 'SUCCESS';
                jsonResult['message'] = 'Query was successfully executed.';
                jsonResult['resultset'] = results;
            
                // Don't use the connection here, it has been returned to the pool.
                return resolve(jsonResult);
            });
        });
    })
    .catch((jsonError) => {
        console.error(jsonError['message']);
        return jsonError;
    });
}

async function endAllPoolConnections()
{
    const activeDbName = 'sys';
    if (!pool[activeDbName]) return MySqlDbError.buildJsonError('ACTIVE_DB_NOT_FOUND');

    const jsonResult = {};
    jsonResult['status'] = 'ERROR';
    jsonResult['message'] = '';
    jsonResult['resultset'] = [];
    
    return new Promise((resolve, reject) => {
        pool[activeDbName].end(function(err) {
            if (err)
            {
                jsonResult['message'] = `Failed to end all pool connections: ${err}`;
                return reject(jsonResult);
            }

            jsonResult['status'] = 'SUCCESS';
            jsonResult['message'] = 'Successfully ended all pool connections.';
            return resolve(jsonResult);
        });
    })
    .catch((jsonError) => {
        console.error(jsonError['message']);
        return jsonError;
    });
}

module.exports =
{
    initializePool: initializePool,
    execMySql: execMySql,
    endAllPoolConnections: endAllPoolConnections,
};

// Basic way to create a connection ***********************
// const connection = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'root',
//     password : '^harlaneugenealexthuc4$',
//     ssl  : {
//         // DO NOT DO THIS
//         // set up your ca correctly to trust the connection
//         rejectUnauthorized: false
//     }
// });

// Basic way to connect to a database
// connection.connect(function(err) {
//     if (err) {
//         console.error('error connecting: ' + err.stack);
//         return;
//     }

//     console.log('connected as id ' + connection.threadId);
// });