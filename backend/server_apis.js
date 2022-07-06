const fileSystem = require('fs');
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
const port = 3000;
const whitelistedDomains = process.env.WHITELISTED_DOMAINS.split(' ');
const corsOption = 
{
  origin: function(origin, callback)
  {
    console.log('origin: ', origin);
    if (whitelistedDomains.indexOf(origin) !== -1 || !origin)
    {
      callback(null, true);
    }
    else 
    {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOption));                        // cross-origin resource sharing
app.use(helmet());                                // Secures app, setting HTTP headers
app.options('*', cors())                          // include before other routes
app.use(express.json());                          // for parsing application/json
app.use(express.urlencoded({ extended: true }));  // for parsing application/x-www-form-urlencoded

// ========================================================
// Middleware
// ========================================================
function logger(req, res, next)
{
  console.log('API Endpoint was hit. (This is an example log)');
  next();
}
function processResponse(req, res, next)
{
  if (!res.pendingResponse) return next(new Error('Pending response object is undefined'));
  
  console.log(res.apiEndpoint);
  const status = res.pendingResponse['status'];
  const message = res.pendingResponse['message'];
  const resultset = res.pendingResponse['resultset'];
  if (status === undefined || message === undefined || resultset === undefined) return next(new Error('Pending response is missing expected properties'));
  console.log(message);
  res.json(res.pendingResponse);
}
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
app.use(logger);

// Go through all files under apis and serve the endpoints
const fileArray = fileSystem.readdirSync(process.env.PATH_APIS).map(file => path.join(process.env.PATH_APIS, file));
const apiArray = [].concat.apply([],fileArray.map(filePath => {return require(filePath)}));
// ********************************************************
// TODO: Remove after everything's done
console.log(process.env);
console.log(whitelistedDomains);
console.log(`File Array:`);
console.log(fileArray);
console.log(`API Array:`);
console.log(apiArray);
app.get('/', (req, res) =>
{
  res.send('API endpoints have loaded.');
});
// ********************************************************
for (let i = 0; i < apiArray.length; i++)
{
    const arrayObj = apiArray[i];
    const method = arrayObj['method'];
    const handler = arrayObj['handler'];
    const path = arrayObj['path'];
    const options = arrayObj['options'];

    if (method === 'ALL') app.all(`/apis/${path}`, async (req, res, next) =>
    {
      res.pendingResponse = await handler(req,res);
      res.apiEndpoint = `/apis/${path}`;
      next();
    }, processResponse);
    if (method === 'PUT') app.put(`/apis/${path}`, async (req, res, next) =>
    {
      res.pendingResponse = await handler(req,res);
      res.apiEndpoint = `/apis/${path}`;
      next();
    }, processResponse);
    if (method === 'GET') app.get(`/apis/${path}`, async (req, res, next) =>
    {
      res.pendingResponse = await handler(req,res);
      res.apiEndpoint = `/apis/${path}`;
      next();
    }, processResponse);
    if (method === 'POST') app.post(`/apis/${path}`, async (req, res, next) =>
    {
      res.pendingResponse = await handler(req,res);
      res.apiEndpoint = `/apis/${path}`;
      next();
    }, processResponse);
    if (method === 'DELETE') app.delete(`/apis/${path}`, async (req, res, next) =>
    {
      res.pendingResponse = await handler(req,res);
      res.apiEndpoint = `/apis/${path}`;
      next();
    }, processResponse);
}

// ========================================================
// Post-HTTP Request Middleware
// ========================================================
app.use(requestErrorHandler);

// Start the server on the specified port
app.listen(port, () =>
{
  console.log(`Example app listening on port ${port}`)
});
