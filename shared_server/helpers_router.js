const fileSystem = require('fs');
const path = require('path');
const pm2Controller = require('./wrappers_pm2.js');

// ========================================================
// Middleware - General
// ========================================================
function logger(req, res, next)
{
    let apiEndpointUrl = null;
    if (req.originalUrl) apiEndpointUrl = req.originalUrl;
    else if (req.url) apiEndpointUrl = req.url;
    else apiEndpointUrl = 'Url of request is undefined';
    console.log(apiEndpointUrl);
    next();
}
function validateHttpMethod(req, res, next)
{
    const method = req.method;
    if (!['GET', 'PUT', 'POST', 'DELETE'].includes(method)) return res.status(405).send('Method not allowed.');

    next();
}
function requireAuthentication(req, res, next)
{
    // TODO
    next();
}
const execApiHandler = (handler) =>
{
    return async(req, res, next) => {
        res.apiResult = await handler(req, res);
        next();
    }
};
function resolveApiResult(req, res, next)
{
    if (!res.apiResult) return next(new Error('Api Result is undefined'));

    const status = res.apiResult['status'];
    const message = res.apiResult['message'];
    const resultset = res.apiResult['resultset'];
    if (status === undefined || message === undefined || resultset === undefined) return next(new Error('Api Result is missing expected properties'));

    const method = req.method;
    if (status == 'SUCCESS')
    {
        if (method === 'GET') res.status(200);
        if (method === 'POST') res.status(201);
        if (method === 'PUT') res.status(200);
        if (method === 'DELETE') res.status(200);
    }
    // TODO: http status codes for status of error on query (duplicate resource, query failure for some reason, invalid params (bad request), validation failure (bad request), 
    //       general failure of query due to app-specific logic)
    if (status != 'SUCCESS')
    {
        res.status(400);
    }

    console.log(message);
    res.json(res.apiResult);
}

// ========================================================
// Middleware - Errors
// ========================================================
function errorLoadAppRouter(err, req, res, next)
{
    console.error(err); // in prod don't use this or console.log because it is not async.
    const jsonError = {};
    jsonError['status'] = 'ERROR';
    jsonError['message'] = err;
    res.status(500);
    res.json(jsonError);
}
function errorResourceNotFound(req, res, next)
{
    res.status(404).send('Sorry, the requested resource was not found.');
}

// ========================================================
// Middleware - PM2
// ========================================================
async function connectPm(req, res, next)
{
    const jsonConnectToPm2Output = await pm2Controller.pm2Connect();
    if (jsonConnectToPm2Output['status'] != 'SUCCESS')
    {
        console.error(jsonConnectToPm2Output['message']);
        return next(new Error(jsonConnectToPm2Output['message']));
    }
    console.log(jsonConnectToPm2Output['message']);
    next();
}
async function disconnectPm(req, res, next)
{
    console.log('disconnectPm');
    pm2Controller.pm2Disconnect();
    next();
}

// ========================================================
// Load API Routes
// ========================================================
function loadAppRouter(router, pathToApis, preApiHandlerMiddleware, postApiHandlerMiddleware)
{
    const apiBaseUrl = process.env.APIS_BASE_URL;
    const servicePath = process.env.SERVICE_PATH;
    const resolvedPathAllApis = [apiBaseUrl, '*'].join('/');

    // Go through all files under apis and serve the endpoints
    let filesArray = [];
    const apiGroups = [];
    const filesAndFoldersArray = fileSystem.readdirSync(pathToApis);
    for (const el of filesAndFoldersArray)
    {
        const jsonFile = {};
        if (path.extname(el) === '.js') {
            jsonFile['fileName'] = el;
            jsonFile['apiGroup'] = null;
            filesArray.push(jsonFile);
        } else {
            apiGroups.push(el);
        }
    }
    for (const group of apiGroups)
    {
        const nestedFiles = fileSystem.readdirSync(`${pathToApis}/${group}`);
        const nestedFilesArray = nestedFiles.map((file) => {
            const jsonFile = {};
            jsonFile['fileName'] = file;
            jsonFile['apiGroup'] = group;
            return jsonFile;
        });
        filesArray.push(...nestedFilesArray);
    }
    
    // const fileArray = fileSystem.readdirSync(pathToApis).map(file => path.join(pathToApis, file));
    // const apiArray = [].concat.apply([], filesArray.map(filePath => { return require(filePath) }));
    const moduleArray = [].concat.apply([], filesArray.map(jsonFile => { 
        let completeFilePath = null;
        if (jsonFile['apiGroup'] == null) completeFilePath = path.join(pathToApis, jsonFile['fileName']);
        if (jsonFile['apiGroup'] != null) completeFilePath = path.join(pathToApis, jsonFile['apiGroup'], jsonFile['fileName']);

        console.log(completeFilePath);

        const jsonApiObj = {};
        jsonApiObj['apiGroup'] = jsonFile['apiGroup'];
        jsonApiObj['apiArray'] = require(completeFilePath);
        return jsonApiObj;
    }));

    for (let i = 0; i < moduleArray.length; i++) {
        const jsonApiObj = moduleArray[i];
        const apiGroup = jsonApiObj['apiGroup']; 
        const apiArray = jsonApiObj['apiArray'];
        console.log(`API Array: `, apiArray.map((a) => `\n\t${a.path}`).join(''));

        for (let j = 0; j < apiArray.length; j++)
        {
            const api = apiArray[j];
            const method = api['method'];
            const handler = api['handler'];
            const apiPath = api['path'];
            const options = api['options'];
            const isApiPublic = options['public'];
    
            let resolvedPath = null;
            if (apiGroup == null) resolvedPath = [apiBaseUrl, servicePath, apiPath].join('/');
            if (apiGroup != null) resolvedPath = [apiBaseUrl, servicePath, apiGroup, apiPath].join('/');
            console.log(resolvedPath);
    
            // if (method === 'ALL') router.all(resolvedPath, preApiHandlerMiddleware, execApiHandler(handler), postApiHandlerMiddleware);
            if (isApiPublic)            router.all(resolvedPathAllApis, validateHttpMethod);
            if (!isApiPublic)           router.all(resolvedPathAllApis, validateHttpMethod, requireAuthentication);
            if (method === 'GET')       router.get(resolvedPath, preApiHandlerMiddleware, execApiHandler(handler), postApiHandlerMiddleware);
            if (method === 'PUT')       router.put(resolvedPath, preApiHandlerMiddleware, execApiHandler(handler), postApiHandlerMiddleware);
            if (method === 'POST')      router.post(resolvedPath, preApiHandlerMiddleware, execApiHandler(handler), postApiHandlerMiddleware);
            if (method === 'DELETE')    router.delete(resolvedPath, preApiHandlerMiddleware, execApiHandler(handler), postApiHandlerMiddleware);
        }
    }
}

// ================================================================================================
// Load App Router Wrappers
// ================================================================================================
function loadAppRouterBase(router, pathToApis)
{
    const preApiHandlerMiddleware = [];
    const postApiHandlerMiddleware = [resolveApiResult];

    // Define middleware flow - order matters
    router.use(logger);
    loadAppRouter(router, pathToApis, preApiHandlerMiddleware, postApiHandlerMiddleware);
}
function loadAppRouterProc(router, pathToApis)
{
    const preApiHandlerMiddleware = [connectPm];
    // const postApiHandlerMiddleware = [disconnectPm, resolveApiResult];
    const postApiHandlerMiddleware = [resolveApiResult];

    // Define middleware flow - order matters
    router.use(logger);
    loadAppRouter(router, pathToApis, preApiHandlerMiddleware, postApiHandlerMiddleware);
}
function loadErrorLoadAppRouter(router)
{
    router.use(errorLoadAppRouter);
}
function loadErrorResourceNotFound(router)
{
    router.use(errorResourceNotFound);
}
function loadStaticPathNotFoundRedirect(router, pathToRedirect)
{
    // Catch-all route if static file path is invalid
    router.all('*', (req, res) => {
        try {
            // res.sendFile(pathToRedirect);
            res.redirect(pathToRedirect);
        } catch (error) {
            res.json({ success: false, message: 'Something went wrong' });
        }
    });
}

module.exports =
{
    loadAppRouterBase: loadAppRouterBase,
    loadAppRouterProc: loadAppRouterProc,
    loadErrorLoadAppRouter: loadErrorLoadAppRouter,
    loadErrorResourceNotFound: loadErrorResourceNotFound,
    loadStaticPathNotFoundRedirect: loadStaticPathNotFoundRedirect,
};