// const fileSystem = require('fs');
const path = require('path');
const config = require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
if (config.error)
{
  console.error('Failed to load environmental variables');
  throw config.error;
}
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
// const port = 3010;
// const whitelistedDomains = process.env.WHITELISTED_DOMAINS.split(' ');
const pathToPackagedApp = __dirname + '/dist/';
const corsOption =
{
    origin: "http://localhost:8080"
};
// const corsOption = 
// {
//   origin: function(origin, callback)
//   {
//     console.log('origin: ', origin);
//     if (whitelistedDomains.indexOf(origin) !== -1 || !origin)
//     {
//       callback(null, true);
//     }
//     else 
//     {
//       callback(new Error('Not allowed by CORS'));
//     }
//   }
// };

app.use(cors(corsOption));                        // cross-origin resource sharing
// Secures app, setting HTTP headers
// app.use(helmet.contentSecurityPolicy({
//     directives: {
//         "connect-src": ["http://localhost:8080"]
//     }
// }));
// app.use(helmet.crossOriginEmbedderPolicy());
// app.use(helmet.crossOriginOpenerPolicy());
// app.use(helmet.crossOriginResourcePolicy());
// app.use(helmet.dnsPrefetchControl());
// app.use(helmet.expectCt());
// app.use(helmet.frameguard());
// app.use(helmet.hidePoweredBy());
// app.use(helmet.hsts());
// app.use(helmet.ieNoOpen());
// app.use(helmet.noSniff());
// app.use(helmet.originAgentCluster());
// app.use(helmet.permittedCrossDomainPolicies());
// app.use(helmet.referrerPolicy());
// app.use(helmet.xssFilter());
app.options('*', cors())                          // include before other routes
app.use(express.json());                          // for parsing application/json
app.use(express.urlencoded({ extended: true }));  // for parsing application/x-www-form-urlencoded

// ========================================================
// Middleware
// ========================================================
// function logger(req, res, next)
// {
//   console.log('API Endpoint was hit. (This is an example log)');
//   next();
// }
// function processResponse(req, res, next)
// {
//   if (!res.pendingResponse) return next(new Error('Pending response object is undefined'));
  
//   console.log(res.apiEndpoint);
//   const status = res.pendingResponse['status'];
//   const message = res.pendingResponse['message'];
//   const resultset = res.pendingResponse['resultset'];
//   if (status === undefined || message === undefined || resultset === undefined) return next(new Error('Pending response is missing expected properties'));
//   console.log(message);
//   res.json(res.pendingResponse);
// }
function requestErrorHandler(err, req, res, next)
{
  console.error(err);
  const jsonError = {};
  jsonError['status'] = 'ERROR';
  jsonError['message'] = err;
  res.json(jsonError);
}

// ========================================================
// Pre-HTTP Request Middleware
// ========================================================
// app.use(logger);

// Go through all files under apis and serve the endpoints
// const fileArray = fileSystem.readdirSync(process.env.PATH_APIS).map(file => path.join(process.env.PATH_APIS, file));
// const apiArray = [].concat.apply([],fileArray.map(filePath => {return require(filePath)}));
// ********************************************************
// TODO: Remove after everything's done
console.log(process.env);
// console.log(whitelistedDomains);

// This line serves statics
app.use(express.static('public'));
app.use(express.static(pathToPackagedApp));

app.get('/', (_req, res) =>
{
    res.sendFile(pathToPackagedApp + 'index.html');
});
app.all("*", (_req, res) => 
{
    try {
        res.sendFile(pathToPackagedApp + 'index.html');
    } catch (err) {
        res.json({ success: false, message: "Something went wrong" });
    }
});

// ========================================================
// Post-HTTP Request Middleware
// ========================================================
app.use(requestErrorHandler);

// Start the server on the specified port
app.listen(process.env.PORT_SYS_WEBSERVER, () =>
{
  console.log(`Example app listening on port ${process.env.PORT_SYS_WEBSERVER}`);
});
