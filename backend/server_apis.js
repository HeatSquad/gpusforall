const config = require('dotenv').config();
if (config.error)
{
  console.error('Failed to load environmental variables');
  throw config.error;
}
console.log(process.env);
const express = require('express');
const app = express();
const fileSystem = require('fs');
const path = require('path');
const port = 3000;

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
  
  const status = res.pendingResponse['status'];
  const message = res.pendingResponse['message'];
  const resultset = res.pendingResponse['resultset'];
  if (status === undefined || message === undefined || resultset === undefined) return next(new Error('Pending response is missing expected properties'));

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
app.use(logger);

// Go through all files under apis and serve the endpoints
const fileArray = fileSystem.readdirSync(process.env.PATH_APIS).map(file => path.join(process.env.PATH_APIS, file));
const apiArray = [].concat.apply([],fileArray.map(filePath => {return require(filePath)}));
console.log(`File Array:`);
console.log(fileArray);
console.log(`API Array:`);
console.log(apiArray);
// TODO: Remove after everything's done
app.get('/', (req, res) =>
{
  res.send('API endpoints have loaded.');
});
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
      next();
    }, processResponse);
    if (method === 'PUT') app.put(`/apis/${path}`, async (req, res, next) =>
    {
      res.pendingResponse = await handler(req,res);
      next();
    }, processResponse);
    if (method === 'GET') app.get(`/apis/${path}`, async (req, res, next) =>
    {
      res.pendingResponse = await handler(req,res);
      next();
    }, processResponse);
    if (method === 'POST') app.post(`/apis/${path}`, async (req, res, next) =>
    {
      res.pendingResponse = await handler(req,res);
      next();
    }, processResponse);
    if (method === 'DELETE') app.delete(`/apis/${path}`, async (req, res, next) =>
    {
      res.pendingResponse = await handler(req,res);
      next();
    }, processResponse);
}

// Post-HTTP Request Middleware
app.use(requestErrorHandler);

// Start the server on the specified port
app.listen(port, () =>
{
  console.log(`Example app listening on port ${port}`)
});
