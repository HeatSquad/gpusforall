/**
 * TODO:
 * 1) cors
 * 2) whitelisted domains
 * 3) helmet => contentsecuritypolicy?
 * app.use(helmet.contentSecurityPolicy({
      directives: {
          "connect-src": ["http://localhost:8080"]
      }
  }));
 * 4) Logging
 * 5) Error handling
 * 
 */
const path = require('path');
const config = require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
if (config.error) {
    console.error('Failed to load environmental variables');
    throw config.error;
}
const scriptName = path.basename(__filename);
const port = process.env.PORT;
// const whitelistedDomains = process.env.WHITELISTED_DOMAINS.split('|');

const express = require('express');
const router = express.Router();
// const helmet = require('helmet');
const cors = require('cors');
const corsOption =
{
    origin: "http://localhost:8080"
};
const { loadStaticPathNotFoundRedirect } = require('./../shared_server/general.js');

// ============================================================================
// Express Routes and Statics
// ============================================================================
const app = express();
app.use(cors(corsOption));                        // Resolves cross-origin resource sharing
app.options('*', cors())                          // Enables pre-flighting for requests with methods other than GET/HEAD/POST (like DELETE)
// app.use(helmet());                             // Secures app, setting HTTP headers
app.use(express.json({ limit: '10mb' }));                           // for parsing application/json
app.use(express.urlencoded({ limit: '10mb', extended: true }));     // for parsing application/x-www-form-urlencoded

const pathToPublicAssets = path.join(__dirname, './public', './images');
const pathToFavicon = path.join(__dirname, './public', 'favicon.ico');
const pathToStatics = path.join(__dirname, './dist');
const pathToIndex = path.join(__dirname, './dist/index.html');

// TODO: Remove later =========================================================
console.log('Path to public assets: ', pathToPublicAssets);
console.log('Path to favicon: ', pathToFavicon);
console.log('Path to statics: ', pathToStatics);
console.log('Path to index: ', pathToIndex);
// ============================================================================

router.use(express.static(pathToPublicAssets));         // Loads public assets
router.use(express.static(pathToFavicon));              // Loads favicon
router.use(express.static(pathToStatics));              // Loads statics of current service
router.get('/', (req, res, next) => {                   // Serve on root
    res.sendFile(pathToIndex);
});
loadStaticPathNotFoundRedirect(router, '/');    // Load error handlers
app.use(router);

// ============================================================================
// Server Startup
// ============================================================================
const httpServer = app.listen(port, () => {
    console.log(`${scriptName} listening on port ${port}`);
    process.send('ready');
});
httpServer.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.log(`${scriptName} is in use.`);
    }
});
// Intercept signal for graceful restart/reload/stop
// Note: Only works on linux servers, won't work on windows
process.on('SIGINT', () => {
    console.log(`SIGINT signal received: closing server ${scriptName}`);

    // Stops the server from accepting new connections and finishes existing connections
    httpServer.close((err) => {
        if (err) {
            console.error(err)
            process.exit(1);
        }
        console.log(`HTTP server ${scriptName} closed.`);

        // Close any db connections/end processing jobs here
        // --

        // Exit with succss (code 0)
        process.exit(0);
    });
});
