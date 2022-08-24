const path = require('path');
const config = require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
if (config.error) {
    console.error('Failed to load environmental variables');
    throw config.error;
}
const scriptName = path.basename(__filename);
const port = process.env.PORT;
const whitelistedDomains = process.env.WHITELISTED_DOMAINS.split('|');

const express = require('express');
const router = express.Router();
const helmet = require('helmet');
const cors = require('cors');
const corsOption =
{
    origin: function (origin, callback) {
        console.log('origin: ', origin);
        if (whitelistedDomains.indexOf(origin) !== -1 || !origin) { callback(null, true); }
        else { callback(new Error('Not allowed by CORS')); }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH']
};
const { loadAppRouterProc, loadErrorLoadAppRouter, loadErrorResourceNotFound } = require('./../shared_server/general.js');
const { initializePool, endAllPoolConnections } = require('./../shared_server/wrappers_mysql.js');

// ============================================================================
// Database Connections
// ============================================================================
const dbConfig = {};
dbConfig[process.env.MYSQL_DATABASE] = {};
dbConfig[process.env.MYSQL_DATABASE]['host'] = process.env.MYSQL_HOST;
dbConfig[process.env.MYSQL_DATABASE]['port'] = process.env.MYSQL_PORT;
dbConfig[process.env.MYSQL_DATABASE]['user'] = process.env.MYSQL_USER;
dbConfig[process.env.MYSQL_DATABASE]['password'] = process.env.MYSQL_PASSWORD;
dbConfig[process.env.MYSQL_DATABASE]['database'] = process.env.MYSQL_DATABASE;
dbConfig[process.env.MYSQL_DATABASE]['connectionLimit'] = 100;
dbConfig[process.env.MYSQL_DATABASE]['queueLimit'] = 0;
dbConfig[process.env.MYSQL_DATABASE]['waitForConnections'] = true;
initializePool(dbConfig);

// ============================================================================
// Express Routes and Statics
// ============================================================================
const app = express();
app.use(cors(corsOption));                          // Resolves cross-origin resource sharing
app.options('*', cors())                            // Enables pre-flighting for requests with methods other than GET/HEAD/POST (like DELETE)
app.use(helmet());                                  // Secures app, setting HTTP headers
app.use(express.json({limit: '10mb'}));                            // for parsing application/json
app.use(express.urlencoded({ limit: '10mb', extended: true }));    // for parsing application/x-www-form-urlencoded

const pathToApis = path.join(__dirname, './apis');
const pathToStatics = path.join(__dirname, './statics');
// TODO: Remove later =========================================================
console.log('Path to apis: ', pathToApis);
console.log('Path to statics: ', pathToStatics);
// ============================================================================

loadAppRouterProc(router, pathToApis);                  // Loads API routes for current service
loadErrorLoadAppRouter(router);                         // Loads error handlers
loadErrorResourceNotFound(router);
app.use(router);

// ============================================================================
// Server Startup
// ============================================================================
const httpServer = app.listen(port, () => {
    console.log(`${scriptName} listening on port ${port}`);
    process.send('ready');
});
httpServer.on('error', (e) => {
    if (e.code === 'EADDRINUSE')
    {
        console.log(`${scriptName} is in use.`);
    }
});
// Intercept signal for graceful restart/reload/stop
// Note: Only works on linux servers, won't work on windows
process.on('SIGINT', () => {
    console.log(`SIGINT signal received: closing server ${scriptName}`);

    // Stops the server from accepting new connections and finishes existing connections
    httpServer.close((err) => {
        if (err)
        {
            console.error(err)
            process.exit(1);
        }
        console.log(`HTTP server ${scriptName} closed.`);

        // Close any db connections/end processing jobs here
        endAllPoolConnections(() => {
            // Exit with succss (code 0)
            process.exit(0); 
        });
    });
});
