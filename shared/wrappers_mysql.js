const mysql = require('mysql2');

// ========================================================
// Connection Initialization and Event Handling
// ========================================================
// Create the pool of connections
// Connections are lazily created by the pool.
// Connections are also cycled round-robin style
let pool = null;
async function initializePool()
{
    pool = await mysql.createPool({
        host            : 'localhost',
        port            :  3306,
        user            : 'root',
        password        : '^harlaneugenealexthuc4$',
        database        : 'sys',
        waitForConnections: true,
        connectionLimit : 100,
        queueLimit      : 0,
    });

    if (pool != null) console.log('Pool was created');
    if (pool == null) console.log('Pool failed to be created');
    
    // Pool Events
    pool.on('acquire', function(connection)
    {
        console.log('Connection %d acquired', connection.threadId);
    });
    pool.on('connection', function(connection)
    {
        // connection.query('SET SESSION auto_increment_increment=1')
        console.log('Connection was made');
    });
    pool.on('enqueue', function ()
    {
        console.log('Waiting for available connection slot');
    });
    pool.on('release', function(connection)
    {
        console.log('Connection %d released', connection.threadId);
    });
}

function endAllPoolConnections()
{
    // TODO: Release all connections (check each connection)
    // pool.end(function(err) {
    //     // all connections in the pool have ended
    //     console.log('All connections in the pool have ended');
    // });
}

// ========================================================
// Callable functions
// ========================================================
async function execMySql(sqlStmt, arrayBindParams, isWriting)
{
    if (pool == null) await initializePool();
    if (pool == null)
    {
        const jsonPoolError = {};
        jsonPoolError['status'] = 'ERROR';
        jsonPoolError['message'] = '';
        jsonPoolError['resultset'] = null;
        // jsonPoolError['fields'] = null;
        return jsonPoolError;
    }

    const jsonExecMySqlPromise = new Promise((resolve, reject) =>
    {
        const jsonResult = {};
        jsonResult['status'] = 'ERROR';
        jsonResult['message'] = '';
        jsonResult['resultset'] = [];
        // jsonResult['fields'] = null;

        pool.getConnection(function(errorConnection, connection) 
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
                // jsonResult['fields'] = fields;
            
                // Don't use the connection here, it has been returned to the pool.
                return resolve(jsonResult);
            });
        });
    })
    .catch((jsonError) => {
        console.error(jsonError['message']);
        return jsonError;
    });
    const jsonExecMySqlOutput = await jsonExecMySqlPromise;
    return jsonExecMySqlOutput;
}
module.exports =
{
    initializePool: initializePool,
    execMySql: execMySql,
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