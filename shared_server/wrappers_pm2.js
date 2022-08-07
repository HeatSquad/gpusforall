const pm2 = require('pm2');

function pm2Connect()
{
    const jsonResult = {};
    jsonResult['status'] = 'ERROR';
    jsonResult['message'] = '';
    jsonResult['resultset'] = [];

    return new Promise((resolve, reject) => {
        pm2.connect(function(err) {
            if (err) return reject(err);

            jsonResult['status'] = 'SUCCESS';
            jsonResult['message'] = 'Successfully connected to pm2';
            return resolve(jsonResult);
        });
    }).catch((err) => {
        const errorMessage = err.toString();
        jsonResult['message'] = `Failed to connect to pm2: ${errorMessage}`;
        return jsonResult;
    });
}

function pm2Disconnect()
{
    pm2.disconnect();
}

function pm2StartService(options)
{
    const jsonResult = {};
    jsonResult['status'] = 'ERROR';
    jsonResult['message'] = '';
    jsonResult['resultset'] = [];

    return new Promise((resolve, reject) => {
        pm2.start(options, function(err, proc) {
            if (err) return reject(err);

            jsonResult['status'] = 'SUCCESS';
            jsonResult['message'] = 'Successfully started service';
            jsonResult['resultset'] = proc;
            return resolve(jsonResult);
        });
    }).catch((err) => {
        const errorMessage = err.toString();
        jsonResult['message'] = `Failed to start service: ${errorMessage}`;
        return jsonResult;
    });
}

function pm2StopService(processIdentifier)
{
    const jsonResult = {};
    jsonResult['status'] = 'ERROR';
    jsonResult['message'] = '';
    jsonResult['resultset'] = [];

    return new Promise((resolve, reject) => {
        pm2.stop(processIdentifier, function(err, procs) {
            if (err) return reject(err);

            jsonResult['status'] = 'SUCCESS';
            jsonResult['message'] = 'Successfully started service';
            jsonResult['resultset'] = procs;
            return resolve(jsonResult);
        });
    }).catch((err) => {
        const errorMessage = err.toString();
        jsonResult['message'] = `Failed to stop service: ${errorMessage}`;
        return jsonResult;
    });
}

function pm2RestartService(processIdentifier)
{
    const jsonResult = {};
    jsonResult['status'] = 'ERROR';
    jsonResult['message'] = '';
    jsonResult['resultset'] = [];

    return new Promise((resolve, reject) => {
        pm2.restart(processIdentifier, function(err, proc) {
            if (err) return reject(err);

            jsonResult['status'] = 'SUCCESS';
            jsonResult['message'] = 'Successfully restarted service';
            jsonResult['resultset'] = proc;
            return resolve(jsonResult);
        });
    }).catch((err) => {
        const errorMessage = err.toString();
        jsonResult['message'] = `Failed to restart service: ${errorMessage}`;
        return jsonResult;
    });
}

function pm2DeleteService(processIdentifier)
{
    const jsonResult = {};
    jsonResult['status'] = 'ERROR';
    jsonResult['message'] = '';
    jsonResult['resultset'] = [];

    return new Promise((resolve, reject) => {
        pm2.delete(processIdentifier, function(err, proc) {
            if (err) return reject(err);

            jsonResult['status'] = 'SUCCESS';
            jsonResult['message'] = 'Successfully deleted service';
            jsonResult['resultset'] = proc;
            return resolve(jsonResult);
        });
    }).catch((err) => {
        const errorMessage = err.toString();
        jsonResult['message'] = `Failed to delete service: ${errorMessage}`;
        return jsonResult;
    });
}

function pm2StartEcosystem(pathToEcosystem)
{
    const jsonResult = {};
    jsonResult['status'] = 'ERROR';
    jsonResult['message'] = '';
    jsonResult['resultset'] = [];

    return new Promise((resolve, reject) => {
        pm2.start(pathToEcosystem, function(err, procs) {
            if (err) return reject(err);

            jsonResult['status'] = 'SUCCESS';
            jsonResult['message'] = 'Successfully started ecosystem';
            jsonResult['resultset'] = procs;
            return resolve(jsonResult);
        });
    }).catch((err) => {
        const errorMessage = err.toString();
        jsonResult['message'] = `Failed to start ecosystem: ${errorMessage}`;
        return jsonResult;
    });
}

function pm2LaunchBus()
{
    const jsonResult = {};
    jsonResult['status'] = 'ERROR';
    jsonResult['message'] = '';
    jsonResult['resultset'] = [];

    return new Promise((resolve, reject) => {
        pm2.launchBus(function(err, bus) {
            if (err) return reject(err);

            jsonResult['status'] = 'SUCCESS';
            jsonResult['message'] = 'Successfully launched bus';
            jsonResult['resultset'] = [bus];
            return resolve(jsonResult);
        });
    }).catch((err) => {
        const errorMessage = err.toString();
        jsonResult['message'] = `Failed to launch bus: ${errorMessage}`;
        return jsonResult;
    });
}

function pm2List()
{
    const jsonResult = {};
    jsonResult['status'] = 'ERROR';
    jsonResult['message'] = '';
    jsonResult['resultset'] = [];

    return new Promise((resolve, reject) => {
        pm2.list(function(err, processDescriptionList) {
            if (err) return reject(err);

            jsonResult['status'] = 'SUCCESS';
            jsonResult['message'] = 'Successfully listed all services';
            jsonResult['resultset'] = processDescriptionList;
            return resolve(jsonResult);
        });
    }).catch((err) => {
        const errorMessage = err.toString();
        jsonResult['message'] = `Failed to list all services: ${errorMessage}`;
        return jsonResult;
    });
}

// processIdentifier is either the target name (string) or target process ID (number)
function pm2Describe(processIdentifier)
{
    const jsonResult = {};
    jsonResult['status'] = 'ERROR';
    jsonResult['message'] = '';
    jsonResult['resultset'] = [];

    return new Promise((resolve, reject) => {
        pm2.describe(processIdentifier, function(err, processDescription) {
            if (err) return reject(err);

            jsonResult['status'] = 'SUCCESS';
            jsonResult['message'] = 'Successfully described service';
            jsonResult['resultset'] = processDescription;
            return resolve(jsonResult);
        });
    }).catch((err) => {
        const errorMessage = err.toString();
        jsonResult['message'] = `Failed to describe service: ${errorMessage}`;
        return jsonResult;
    });
}

module.exports =
{
    pm2Connect: pm2Connect,
    pm2Disconnect: pm2Disconnect,
    pm2StartService: pm2StartService,
    pm2StopService: pm2StopService,
    pm2RestartService: pm2RestartService,
    pm2DeleteService: pm2DeleteService,
    pm2StartEcosystem: pm2StartEcosystem,
    pm2LaunchBus: pm2LaunchBus,
    pm2List: pm2List,
    pm2Describe: pm2Describe,
}
