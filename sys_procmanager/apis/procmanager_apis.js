/**
 * NOTE: Graceful startup/restart/shutdown using this API does NOT include sys_procmanager because it is the service that is making the request. 
 * To include sys_procmanager in startup/restart/shutdown for entire ecosystem, use utility scripts.
 * Alternatively, restart sys_procmanager manually using ecosystem_*.json
 */
const mySqlConnection = require('../../shared_server/wrappers_mysql.js');
const gpusGeneral = require('../../shared_server/general.js');
const pm2Controller = require('../../shared_server/wrappers_pm2.js');
const ecosystemDev = require('../../config/ecosystem_dev.json');
const ecosystemProd = require('../../config/ecosystem_prod.json');

const apiArray = [];
module.exports = apiArray;

async function replyto_jsonFetchAllServices(req, res)
{
    const jsonListServicesOutput = await pm2Controller.pm2List();
    if (jsonListServicesOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to fetch all services with pm2 list` , req, res);

    const processedListOfServices = jsonListServicesOutput['resultset'].map((service) => {
        const jsonService = {};
        jsonService['pm_id'] = service['pm_id'];
        jsonService['name'] = service['name'];
        jsonService['pid'] = service['pid'];
        jsonService['instances'] = service['pm2_env']['instances'];
        jsonService['port'] = service['pm2_env']['PORT'];
        jsonService['uptime'] = service['pm2_env']['pm_uptime'];
        jsonService['cpu'] = service['monit']['cpu'];
        jsonService['mem'] = service['monit']['memory'];
        jsonService['mode'] = service['pm2_env']['exec_mode'];
        jsonService['status'] = service['pm2_env']['status'];
        return jsonService;
    });

    return gpusGeneral.buildJsonSuccessMessage(`Fetched all active services`, processedListOfServices, req, res);
}
apiArray.push(
    {
        method: 'GET',
        handler: replyto_jsonFetchAllServices,
        path: 'jsonFetchAllServices',
        options:
        {
            public: true,
            description: 'Fetches all active services currently running and managed by PM2',
            group: 'Process Management',
            sampleParams: {}
        }
    }
);

async function replyto_jsonFetchServiceDescription(req, res)
{
    if (req.params.pm_id === undefined) return gpusGeneral.buildJsonInvalidParameters(`Missing required parameter: pm_id`, req, res);
    if (isNaN(parseInt(req.params.pm_id))) return gpusGeneral.buildJsonErrorMessage(`pm_id is not a number`, req, res);

    const pmId = req.params.pm_id;

    const jsonDescribeServiceOutput = await pm2Controller.pm2Describe(pmId);
    if (jsonDescribeServiceOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to fetch service description with pm2 describe` , req, res);

    console.log(jsonDescribeServiceOutput);

    const processedListOfServices = jsonDescribeServiceOutput['resultset'].map((service) => {
        const jsonService = {};
        jsonService['pm_id'] = service['pm_id'];
        jsonService['name'] = service['name'];
        jsonService['pid'] = service['pid'];
        jsonService['instances'] = service['pm2_env']['instances'];
        jsonService['port'] = service['pm2_env']['PORT'];
        jsonService['uptime'] = service['pm2_env']['pm_uptime'];
        jsonService['cpu'] = service['monit']['cpu'];
        jsonService['mem'] = service['monit']['memory'];
        jsonService['mode'] = service['pm2_env']['exec_mode'];
        jsonService['status'] = service['pm2_env']['status'];
        return jsonService;
    });

    return gpusGeneral.buildJsonSuccessMessage(`Fetched service description`, processedListOfServices, req, res);
}
apiArray.push(
    {
        method: 'GET',
        handler: replyto_jsonFetchServiceDescription,
        path: 'jsonFetchServiceDescription/:pm_id',
        options:
        {
            public: true,
            description: 'Fetches process description of a specific service managed by PM2',
            group: 'Process Management',
            sampleParams:
            {
                "pm_id": 0,
            }
        }
    }
);

async function replyto_jsonFetchCurrentNetworkAddress(req, res)
{
    let jsonNetworkAddress = null;
    if (process.env.NODE_ENV === 'development') jsonNetworkAddress = gpusGeneral.identifyLoopbackNetworkAddress();
    if (process.env.NODE_ENV === 'production') jsonNetworkAddress = gpusGeneral.identifyExternalNetworkAddress();
    if (jsonNetworkAddress == null) return gpusGeneral.buildJsonErrorMessage('Failed to identify network address', req, res);
    // const ipAddress = jsonNetworkAddress['address'];
    // const subnetMask = jsonNetworkAddress['netmask'];
    return gpusGeneral.buildJsonSuccessMessage(`Fetched network information`, [jsonNetworkAddress], req, res);
}
apiArray.push(
    {
        method: 'GET',
        handler: replyto_jsonFetchCurrentNetworkAddress,
        path: 'jsonFetchCurrentNetworkAddress',
        options:
        {
            public: true,
            description: 'Fetches ip address and network information of current network',
            group: 'Process Management',
            sampleParams: {}
        }
    }
);

// ===========================================================================
// Ecosystem
// ===========================================================================
async function replyto_jsonRestartEcosystem(req, res)
{
    if (!process.env.NODE_ENV) return gpusGeneral.buildJsonErrorMessage(`Missing environmental variable: NODE_ENV`, req, res);

    // Fetch ecosystem json
    let jsonApps = null;
    if (process.env.NODE_ENV === 'development') jsonApps = ecosystemDev;
    if (process.env.NODE_ENV === 'production') jsonApps = ecosystemProd;
    if (jsonApps == null) return gpusGeneral.buildJsonErrorMessage(`Failed to load ecosystem json` , req, res);
    const apps = jsonApps['apps'];

    // Validate that there are no duplicates
    const lookupDuplicates = {};
    for (const options of apps)
    {
        if (lookupDuplicates[options['name']] !== undefined) return gpusGeneral.buildJsonErrorMessage(`Found duplicate service in ecosystem file: ${options['name']}`, req, res);
        lookupDuplicates[options['name']] =options['name'];
    }

    // Identify network address
    let jsonNetworkAddress = null;
    if (process.env.NODE_ENV === 'development') jsonNetworkAddress = gpusGeneral.identifyLoopbackNetworkAddress();
    if (process.env.NODE_ENV === 'production') jsonNetworkAddress = gpusGeneral.identifyExternalNetworkAddress();
    if (jsonNetworkAddress == null) return gpusGeneral.buildJsonErrorMessage('Failed to identify network address', req, res);
    const ipAddress = jsonNetworkAddress['address'];
    const subnetMask = jsonNetworkAddress['netmask'];

    // ------------------------------------------------------------------------
    // Deregister all services
    const arrayBindParamsDeleteRegistry = [];
    const sqlStmtDeleteRegistry = `
    DELETE FROM sys.registry
    WHERE name <> 'sys_procmanager'
    `;
    const jsonDeleteRegistryPromise = mySqlConnection.execMySql(sqlStmtDeleteRegistry, arrayBindParamsDeleteRegistry);
    const jsonDeleteRegistryOutput = await jsonDeleteRegistryPromise;
    if (jsonDeleteRegistryOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to delete registry`, req, res);

    // Get all instances of every service from pm2
    const jsonListServicesOutput = await pm2Controller.pm2List();
    if (jsonListServicesOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to fetch all services with pm2 list` , req, res);
    const processedListOfServices = jsonListServicesOutput['resultset'].map((service) => {
        const jsonService = {};
        jsonService['pm_id'] = service['pm_id'];
        jsonService['name'] = service['name'];
        jsonService['pid'] = service['pid'];
        jsonService['instances'] = service['pm2_env']['instances'];
        jsonService['port'] = service['pm2_env']['PORT'];
        jsonService['status'] = service['pm2_env']['status'];
        return jsonService;
    });

    // Delete all instances of every service from pm2
    const failedServicesOnDelete = [];
    for (const jsonService of processedListOfServices)
    {
        const pmId = jsonService['pm_id'];
        const name = jsonService['name'];
        const port = jsonService['port'];
        if (name === 'sys_procmanager') continue; // Do not include sys_procmanager
        const jsonStopServiceOutput = await pm2Controller.pm2DeleteService(pmId);
        if (jsonStopServiceOutput['status'] != 'SUCCESS')
        {
            failedServicesOnDelete.push({ name: name, port: port, pmId: pmId, error: jsonStopServiceOutput['message'] });
            continue;
        }
        if (jsonStopServiceOutput['resultset'].length <= 0)
        {
            failedServicesOnDelete.push({ name: name, port: port, pmId: pmId, error: `PM2 process object doesn't exist` });
            continue;
        }
        console.log(`${name} with pm_id ${pmId} succesfully deleted on port [${port}]`);
    }
    
    // Return any errors
    if (failedServicesOnDelete.length > 0)
    {
        const resultset = [];
        const jsonError = {};
        jsonError['error'] = failedServicesOnDelete.map((s) => `\n\t${s['name']} with pm_id ${s['pmId']} on port [${s['port']}]\t\t${s['error']}`).join('\n');
        resultset.push(jsonError);

        console.log('\nWARNING: Failed to delete the following services:');
        console.log(jsonError['error']);

        const jsonBuildError = gpusGeneral.buildJsonErrorMessage(`Failed to delete some services`, req, res);
        jsonBuildError['resultset'] = resultset;
        return jsonBuildError;
    }
    // ------------------------------------------------------------------------

    // Start each service from ecosystem with their own port
    let arrayServicesStarted = [];
    const failedServicesOnStart = [];
    for (const options of apps)
    {
        const name = options['name'];
        const port = options['env']['PORT'];
        if (name === 'sys_procmanager') continue; // Do not include sys_procmanager

        const jsonStartServiceOutput = await pm2Controller.pm2StartService(options);
        if (jsonStartServiceOutput['status'] != 'SUCCESS')
        {
            failedServicesOnStart.push({ name: name, port: port, error: jsonStartServiceOutput['message'] });
            continue;
        }
        if (jsonStartServiceOutput['resultset'].length <= 0)
        {
            failedServicesOnStart.push({ name: name, port: port, error: `PM2 process object doesn't exist` });
            continue;
        }
        arrayServicesStarted.push(...jsonStartServiceOutput['resultset']);
        console.log(`${name} succesfully started on port [${port}]`);
    }

    console.log(arrayServicesStarted);

    // Return any errors
    if (failedServicesOnStart.length > 0)
    {
        const resultset = [];
        const jsonError = {};
        jsonError['error'] = failedServicesOnStart.map((s) => `\n\t${s['name']} on port [${s['port']}]\t\t${s['error']}`).join('\n');
        resultset.push(jsonError);

        console.log('\nWARNING: Failed to start the following services:');
        console.log(jsonError['error']);

        const jsonBuildError = gpusGeneral.buildJsonErrorMessage(`Failed to start some services`, req, res);
        jsonBuildError['resultset'] = resultset;
        return jsonBuildError;
    }
    // ------------------------------------------------------------------------

    // Process all instances of every service that was just started from pm2
    const processedListOfServicesForStart = arrayServicesStarted.map((service) => {
        const jsonService = {};
        jsonService['pm_id'] = service['pm2_env']['pm_id'];
        jsonService['name'] = service['pm2_env']['name'];
        jsonService['service_path'] = service['pm2_env']['SERVICE_PATH'] || '';
        jsonService['pid'] = service['process']['pid'];
        jsonService['instances'] = service['pm2_env']['instances'];
        jsonService['ipaddress'] = ipAddress;
        jsonService['subnet_mask'] = subnetMask;
        jsonService['port'] = service['pm2_env']['PORT'];
        jsonService['status'] = service['pm2_env']['status'];
        return jsonService;
    });

    // Register all services
    // TODO: rewrite into a transaction
    const failedServicesRegister = [];
    for (const jsonService of processedListOfServicesForStart)
    {
        const pmId = jsonService['pm_id'];
        const name = jsonService['name'];
        const servicePath = jsonService['service_path'];
        const pid = jsonService['pid'];
        const instances = jsonService['instances'];
        const ipaddress = jsonService['ipaddress'];
        const subnetMask = jsonService['subnet_mask'];
        const port = jsonService['port'];
        const status = jsonService['status'];

        const arrayBindParamsRegiserService = [];
        arrayBindParamsRegiserService.push(pmId);
        arrayBindParamsRegiserService.push(name);
        arrayBindParamsRegiserService.push(servicePath);
        arrayBindParamsRegiserService.push(pid);
        arrayBindParamsRegiserService.push(instances);
        arrayBindParamsRegiserService.push(ipaddress);
        arrayBindParamsRegiserService.push(subnetMask);
        arrayBindParamsRegiserService.push(port);
        arrayBindParamsRegiserService.push(status);
        const sqlStmtRegisterService = `
        INSERT INTO sys.registry (pm_id, name, service_path, pid, instances, ipaddress, subnet_mask, port, status)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const jsonRegisterServicePromise = mySqlConnection.execMySql(sqlStmtRegisterService, arrayBindParamsRegiserService);
        const jsonRegisterServiceOutput = await jsonRegisterServicePromise;
        if (jsonRegisterServiceOutput['status'] != 'SUCCESS')
        {
            failedServicesRegister.push(jsonService);
        }
    }

    const resultset = [];
    if (failedServicesRegister.length > 0)
    {
        const jsonError = {};
        jsonError['error'] = failedServicesRegister.map((s) => `\n\t${s['name']} with pm_id ${s['pmId']} on port [${s['port']}]\t\t${s['error']}`).join('\n');
        resultset.push(jsonError);

        console.log('\nWARNING: Failed to register the following services:');
        console.log(jsonError['error']);

        const jsonBuildError = gpusGeneral.buildJsonErrorMessage(`Failed to register some services`, req, res);
        jsonBuildError['resultset'] = resultset;
        return jsonBuildError;
    }

    return gpusGeneral.buildJsonSuccessMessage(`Restarting ecosystem completed`, [], req, res);
}
apiArray.push(
    {
        method: 'POST',
        handler: replyto_jsonRestartEcosystem,
        path: 'jsonRestartEcosystem',
        options:
        {
            public: true,
            description: 'Restarts the ecosystem (excluding sys_procmanager)',
            group: 'Process Management',
            sampleParams: {}
        }
    }
);

async function replyto_jsonShutdownEcosystem(req, res)
{
    // Deregister all services
    const arrayBindParamsDeleteRegistry = [];
    const sqlStmtDeleteRegistry = `
    DELETE FROM sys.registry
    WHERE name <> 'sys_procmanager'
    `;
    const jsonDeleteRegistryPromise = mySqlConnection.execMySql(sqlStmtDeleteRegistry, arrayBindParamsDeleteRegistry);
    const jsonDeleteRegistryOutput = await jsonDeleteRegistryPromise;
    if (jsonDeleteRegistryOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to delete registry`, req, res);

    // Get all instances of every service from pm2
    const jsonListServicesOutput = await pm2Controller.pm2List();
    if (jsonListServicesOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to fetch all services with pm2 list` , req, res);
    const processedListOfServices = jsonListServicesOutput['resultset'].map((service) => {
        const jsonService = {};
        jsonService['pm_id'] = service['pm_id'];
        jsonService['name'] = service['name'];
        jsonService['pid'] = service['pid'];
        jsonService['instances'] = service['pm2_env']['instances'];
        jsonService['port'] = service['pm2_env']['PORT'];
        jsonService['status'] = service['pm2_env']['status'];
        return jsonService;
    });

    // Delete all instances of every service from pm2
    const failedServicesOnDelete = [];
    for (const jsonService of processedListOfServices)
    {
        const pmId = jsonService['pm_id'];
        const name = jsonService['name'];
        const port = jsonService['port'];
        if (name === 'sys_procmanager') continue; // Do not include sys_procmanager
        const jsonStopServiceOutput = await pm2Controller.pm2DeleteService(pmId);
        if (jsonStopServiceOutput['status'] != 'SUCCESS')
        {
            failedServicesOnDelete.push({ name: name, port: port, pmId: pmId, error: jsonStopServiceOutput['message'] });
            continue;
        }
        if (jsonStopServiceOutput['resultset'].length <= 0)
        {
            failedServicesOnDelete.push({ name: name, port: port, pmId: pmId, error: `PM2 process object doesn't exist` });
            continue;
        }
        console.log(`${name} with pm_id ${pmId} succesfully deleted on port [${port}]`);
    }
    
    // Return any errors
    if (failedServicesOnDelete.length > 0)
    {
        const resultset = [];
        const jsonError = {};
        jsonError['error'] = failedServicesOnDelete.map((s) => `\n\t${s['name']} with pm_id ${s['pmId']} on port [${s['port']}]\t\t${s['error']}`).join('\n');
        resultset.push(jsonError);

        console.log('\nWARNING: Failed to delete the following services:');
        console.log(jsonError['error']);

        const jsonBuildError = gpusGeneral.buildJsonErrorMessage(`Failed to delete some services`, req, res);
        jsonBuildError['resultset'] = resultset;
        return jsonBuildError;
    }

    return gpusGeneral.buildJsonSuccessMessage(`Shutting down ecosystem completed`, [], req, res);
}
apiArray.push(
    {
        method: 'POST',
        handler: replyto_jsonShutdownEcosystem,
        path: 'jsonShutdownEcosystem',
        options:
        {
            public: true,
            description: 'Shuts down the ecosystem (excluding sys_procmanager)',
            group: 'Process Management',
            sampleParams: {}
        }
    }
);

async function replyto_jsonResumeEcosystem(req, res)
{
    // Get all instances of every service from pm2
    const jsonListServicesOutput = await pm2Controller.pm2List();
    if (jsonListServicesOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to fetch all services with pm2 list` , req, res);

    // Check that all instances of the service has stopped/errored
    for (const jsonInstance of jsonListServicesOutput['resultset'])
    {
        const pmId = jsonInstance['pm_id'];
        const processName = jsonInstance['name'];
        const serviceStatus = jsonInstance['pm2_env']['status'];
        if (processName === 'sys_procmanager') continue; // Exclude sys_procmanager
        if (!['stopped', 'errored'].includes(serviceStatus)) return gpusGeneral.buildJsonErrorMessage(`Instance with identifier ${pmId} for service with name ${processName} is not stopped or errored`, req, res)
    }
    // Process all instances of the service
    const processedListOfServices = jsonListServicesOutput['resultset'].map((service) => {
        const jsonService = {};
        jsonService['pm_id'] = service['pm_id'];
        jsonService['name'] = service['name'];
        jsonService['pid'] = service['pid'];
        jsonService['instances'] = service['pm2_env']['instances'];
        jsonService['port'] = service['pm2_env']['PORT'];
        jsonService['status'] = service['pm2_env']['status'];
        return jsonService;
    });

    // Get all instances of every service
    const arrayBindParamsGetAllServices = [];
    const sqlStmtGetAllServices = `
    SELECT pm_id, name
    FROM sys.registry
    WHERE name <> 'sys_procmanager'
    `;
    const jsonGetAllServicesPromise = mySqlConnection.execMySql(sqlStmtGetAllServices, arrayBindParamsGetAllServices);
    const jsonGetAllServicesOutput = await jsonGetAllServicesPromise;
    if (jsonGetAllServicesOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to get all services`, req, res);
    if (jsonGetAllServicesOutput['resultset'].length <= 0) return gpusGeneral.buildJsonErrorMessage(`Failed because there are no services in registry`, req, res);

    // Deregister all instances of every service
    const arrayBindParamsDeregisterServices = [];
    const sqlStmtDeregisterServices = `
    UPDATE sys.registry
    SET status = 'stopped'
    WHERE name <> 'sys_procmanager'
    `;
    const jsonDeregisterServicesPromise = mySqlConnection.execMySql(sqlStmtDeregisterServices, arrayBindParamsDeregisterServices);
    const jsonDeregisterServicesOutput = await jsonDeregisterServicesPromise;
    if (jsonDeregisterServicesOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to deregister all services`, req, res);

    // Restart all instances of every service
    const failedServicesOnRestart = [];
    for (const jsonService of processedListOfServices)
    {
        const pmId = jsonService['pm_id'];
        const name = jsonService['name'];
        const port = jsonService['port'];
        if (name === 'sys_procmanager') continue; // Do not include sys_procmanager
        const jsonStopServiceOutput = await pm2Controller.pm2RestartService(pmId);
        if (jsonStopServiceOutput['status'] != 'SUCCESS')
        {
            failedServicesOnRestart.push({ name: name, port: port, pmId: pmId, error: jsonStopServiceOutput['message'] });
            continue;
        }
        if (jsonStopServiceOutput['resultset'].length <= 0)
        {
            failedServicesOnRestart.push({ name: name, port: port, pmId: pmId, error: `PM2 process object doesn't exist` });
            continue;
        }

        console.log(`${name} with pm_id ${pmId} succesfully restarted on port [${port}]`);
    }
    
    // Return any errors
    if (failedServicesOnRestart.length > 0)
    {
        const resultset = [];
        const jsonError = {};
        jsonError['error'] = failedServicesOnRestart.map((s) => `\n\t${s['name']} with pm_id ${s['pmId']} on port [${s['port']}]\t\t${s['error']}`).join('\n');
        resultset.push(jsonError);

        console.log('\nWARNING: Failed to restart the following services:');
        console.log(jsonError['error']);

        const jsonBuildError = gpusGeneral.buildJsonErrorMessage(`Failed to restart some services`, req, res);
        jsonBuildError['resultset'] = resultset;
        return jsonBuildError;
    }

    // Register all instances of every service
    const arrayBindParamsRegisterServices = [];
    const sqlStmtRegisterServices = `
    UPDATE sys.registry
    SET status = 'online'
    WHERE name <> 'sys_procmanager'
    `;
    const jsonRegisterServicesPromise = mySqlConnection.execMySql(sqlStmtRegisterServices, arrayBindParamsRegisterServices);
    const jsonRegisterServicesOutput = await jsonRegisterServicesPromise;
    if (jsonRegisterServicesOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to register all services`, req, res);

    return gpusGeneral.buildJsonSuccessMessage(`Resuming ecosystem completed`, [], req, res);
}
apiArray.push(
    {
        method: 'POST',
        handler: replyto_jsonResumeEcosystem,
        path: 'jsonResumeEcosystem',
        options:
        {
            public: true,
            description: 'Resumes all instances of every service within ecosystem (excluding sys_procmanager)',
            group: 'Process Management',
            sampleParams: {}
        }
    }
);

async function replyto_jsonStopEcosystem(req, res)
{
    // Get all instances of every service
    const arrayBindParamsGetServices = [];
    const sqlStmtGetAllServices = `
    SELECT pm_id, name
    FROM sys.registry
    WHERE name <> 'sys_procmanager'
    `;
    const jsonGetAllServicesPromise = mySqlConnection.execMySql(sqlStmtGetAllServices, arrayBindParamsGetServices);
    const jsonGetAllServicesOutput = await jsonGetAllServicesPromise;
    if (jsonGetAllServicesOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to get all services`, req, res);
    if (jsonGetAllServicesOutput['resultset'].length <= 0) return gpusGeneral.buildJsonErrorMessage(`Failed because there are no services in registry`, req, res);

    // Deregister all instances of every service
    const arrayBindParamsDeregisterServices = [];
    const sqlStmtDeregisterServices = `
    UPDATE sys.registry
    SET status = 'stopped'
    WHERE name <> 'sys_procmanager'
    `;
    const jsonDeregisterServicesPromise = mySqlConnection.execMySql(sqlStmtDeregisterServices, arrayBindParamsDeregisterServices);
    const jsonDeregisterServicesOutput = await jsonDeregisterServicesPromise;
    if (jsonDeregisterServicesOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to deregister all services`, req, res);

    // Get and process all instances of every service from pm2
    const jsonListServicesOutput = await pm2Controller.pm2List();
    if (jsonListServicesOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to fetch all services with pm2 list` , req, res);
    const processedListOfServices = jsonListServicesOutput['resultset'].map((service) => {
        const jsonService = {};
        jsonService['pm_id'] = service['pm_id'];
        jsonService['name'] = service['name'];
        jsonService['pid'] = service['pid'];
        jsonService['instances'] = service['pm2_env']['instances'];
        jsonService['port'] = service['pm2_env']['PORT'];
        jsonService['status'] = service['pm2_env']['status'];
        return jsonService;
    });

    // Stop all instances of every service
    const failedServicesOnStop = [];
    for (const jsonService of processedListOfServices)
    {
        const pmId = jsonService['pm_id'];
        const name = jsonService['name'];
        const port = jsonService['port'];
        if (name === 'sys_procmanager') continue; // Do not include sys_procmanager
        const jsonStopServiceOutput = await pm2Controller.pm2StopService(pmId);
        if (jsonStopServiceOutput['status'] != 'SUCCESS')
        {
            failedServicesOnStop.push({ name: name, port: port, pmId: pmId, error: jsonStopServiceOutput['message'] });
            continue;
        }
        if (jsonStopServiceOutput['resultset'].length <= 0)
        {
            failedServicesOnStop.push({ name: name, port: port, pmId: pmId, error: `PM2 process object doesn't exist` });
            continue;
        }

        console.log(`${name} with pm_id ${pmId} succesfully stopped on port [${port}]`);
    }
    
    // Return any errors
    if (failedServicesOnStop.length > 0)
    {
        const resultset = [];
        const jsonError = {};
        jsonError['error'] = failedServicesOnStop.map((s) => `\n\t${s['name']} with pm_id ${s['pmId']} on port [${s['port']}]\t\t${s['error']}`).join('\n');
        resultset.push(jsonError);

        console.log('\nWARNING: Failed to stop the following services:');
        console.log(jsonError['error']);

        const jsonBuildError = gpusGeneral.buildJsonErrorMessage(`Failed to stop some services`, req, res);
        jsonBuildError['resultset'] = resultset;
        return jsonBuildError;
    }

    return gpusGeneral.buildJsonSuccessMessage(`Stopping ecosystem completed.`, [], req, res);
}
apiArray.push(
    {
        method: 'POST',
        handler: replyto_jsonStopEcosystem,
        path: 'jsonStopEcosystem',
        options:
        {
            public: true,
            description: 'Stops all instances of every service within ecosystem (excluding sys_procmanager)',
            group: 'Process Management',
            sampleParams: {}
        }
    }
);

// ===========================================================================
// All Instances
// ===========================================================================
async function replyto_jsonRestartAllInstances(req, res)
{
    if (req.body.process_name === undefined) return gpusGeneral.buildJsonErrorMessage(`Missing required parameter: process_name`, req, res);
    const processName = req.body.process_name;
    if (processName == 'sys_procmanager') return gpusGeneral.buildJsonErrorMessage(`Invalid request to resume all instance of process: ${processName}`, req, res);
    if (!process.env.NODE_ENV) return gpusGeneral.buildJsonErrorMessage(`Missing environmental variable: NODE_ENV`, req, res);

    // Fetch ecosystem json
    let jsonApps = null;
    if (process.env.NODE_ENV === 'development') jsonApps = ecosystemDev;
    if (process.env.NODE_ENV === 'production') jsonApps = ecosystemProd;
    if (jsonApps == null) return gpusGeneral.buildJsonErrorMessage(`Failed to load ecosystem json` , req, res);
    const apps = jsonApps['apps'];
    const fileterdAppToRestart = apps.filter((a) => a.name === processName);
    if (fileterdAppToRestart.length <= 0) return gpusGeneral.buildJsonErrorMessage(`${processName} was not found in ecosystem`, req, res);
    const appToRestart = fileterdAppToRestart[0];

    // Validate that there are no duplicates
    const lookupDuplicates = {};
    for (const options of apps)
    {
        if (lookupDuplicates[options['name']] !== undefined) return gpusGeneral.buildJsonErrorMessage(`Found duplicate service in ecosystem file: ${options['name']}`, req, res);
        lookupDuplicates[options['name']] =options['name'];
    }

    // Identify network address
    let jsonNetworkAddress = null;
    if (process.env.NODE_ENV === 'development') jsonNetworkAddress = gpusGeneral.identifyLoopbackNetworkAddress();
    if (process.env.NODE_ENV === 'production') jsonNetworkAddress = gpusGeneral.identifyExternalNetworkAddress();
    if (jsonNetworkAddress == null) return gpusGeneral.buildJsonErrorMessage('Failed to identify network address', req, res);
    const ipAddress = jsonNetworkAddress['address'];
    const subnetMask = jsonNetworkAddress['netmask'];

    // Deregister all instances of the service
    const arrayBindParamsDeleteServicesFromRegistry = [];
    arrayBindParamsDeleteServicesFromRegistry.push(processName);
    const sqlStmtDeleteServicesFromRegistry = `
    DELETE FROM sys.registry
    WHERE name = ?
    `;
    const jsonDeleteServicesFromRegistryPromise = mySqlConnection.execMySql(sqlStmtDeleteServicesFromRegistry, arrayBindParamsDeleteServicesFromRegistry);
    const jsonDeleteServicesFromRegistryOutput = await jsonDeleteServicesFromRegistryPromise;
    if (jsonDeleteServicesFromRegistryOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to delete all instances of services with name ${processName} from registry`, req, res);

    // Delete all instances of the service
    const jsonDeleteServicesOutput = await pm2Controller.pm2DeleteService(processName);
    if (jsonDeleteServicesOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to delete all instances of service with name ${processName}`, req, res);

    // Start all instances of the service
    const jsonStartServicesOutput = await pm2Controller.pm2StartService(appToRestart);
    if (jsonStartServicesOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to start service with name ${processName}`, req, res);
    const processedListOfServices = jsonStartServicesOutput['resultset'].map((service) => {
        const jsonService = {};
        jsonService['pm_id'] = service['pm2_env']['pm_id'];
        jsonService['name'] = service['pm2_env']['name'];
        jsonService['service_path'] = service['pm2_env']['SERVICE_PATH'] || '';
        jsonService['pid'] = service['process']['pid'];
        jsonService['instances'] = service['pm2_env']['instances'];
        jsonService['ipaddress'] = ipAddress;
        jsonService['subnet_mask'] = subnetMask;
        jsonService['port'] = service['pm2_env']['PORT'];
        jsonService['status'] = service['pm2_env']['status'];
        return jsonService;
    });

    // Register all instances of the service
    // TODO: rewrite into a transaction
    const failedServicesRegister = [];
    for (const jsonService of processedListOfServices)
    {
        const pmId = jsonService['pm_id'];
        const name = jsonService['name'];
        const servicePath = jsonService['service_path'];
        const pid = jsonService['pid'];
        const instances = jsonService['instances'];
        const ipaddress = jsonService['ipaddress'];
        const subnetMask = jsonService['subnet_mask'];
        const port = jsonService['port'];
        const status = jsonService['status'];

        const arrayBindParamsRegiserService = [];
        arrayBindParamsRegiserService.push(pmId);
        arrayBindParamsRegiserService.push(name);
        arrayBindParamsRegiserService.push(servicePath);
        arrayBindParamsRegiserService.push(pid);
        arrayBindParamsRegiserService.push(instances);
        arrayBindParamsRegiserService.push(ipaddress);
        arrayBindParamsRegiserService.push(subnetMask);
        arrayBindParamsRegiserService.push(port);
        arrayBindParamsRegiserService.push(status);
        const sqlStmtRegisterService = `
        INSERT INTO sys.registry (pm_id, name, service_path, pid, instances, ipaddress, subnet_mask, port, status)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const jsonRegisterServicePromise = mySqlConnection.execMySql(sqlStmtRegisterService, arrayBindParamsRegiserService);
        const jsonRegisterServiceOutput = await jsonRegisterServicePromise;
        if (jsonRegisterServiceOutput['status'] != 'SUCCESS')
        {
            failedServicesRegister.push(jsonService);
        }
    }

    const resultset = [];
    if (failedServicesRegister.length > 0)
    {
        const jsonError = {};
        jsonError['error'] = failedServicesRegister.map((s) => `\n\t${s['name']} with pm_id ${s['pmId']} on port [${s['port']}]\t\t${s['error']}`).join('\n');
        resultset.push(jsonError);
        const jsonBuildError = gpusGeneral.buildJsonErrorMessage(`Failed to register some services`, req, res);
        jsonBuildError['resultset'] = resultset;
        return jsonBuildError;
    }

    return gpusGeneral.buildJsonSuccessMessage(`Restarting all instances completed`, resultset, req, res);
}
apiArray.push(
    {
        method: 'POST',
        handler: replyto_jsonRestartAllInstances,
        path: 'jsonRestartAllInstances',
        options:
        {
            public: true,
            description: 'Restarts all instances of a service by service name (excluding sys_procmanager)',
            group: 'Process Management',
            sampleParams:
            {
                process_name: 'sys_webserverapis'
            }
        }
    }
);

async function replyto_jsonShutdownAllInstances(req, res)
{
    if (req.body.process_name === undefined) return gpusGeneral.buildJsonErrorMessage(`Missing required parameter: process_name`, req, res);
    const processName = req.body.process_name;
    if (processName == 'sys_procmanager') return gpusGeneral.buildJsonErrorMessage(`Invalid request to resume all instance of process: ${processName}`, req, res);

    // Deregister all instances of the service
    const arrayBindParamsDeleteServicesFromRegistry = [];
    arrayBindParamsDeleteServicesFromRegistry.push(processName);
    const sqlStmtDeleteServicesFromRegistry = `
    DELETE FROM sys.registry
    WHERE name = ?
    `;
    const jsonDeleteServicesFromRegistryPromise = mySqlConnection.execMySql(sqlStmtDeleteServicesFromRegistry, arrayBindParamsDeleteServicesFromRegistry);
    const jsonDeleteServicesFromRegistryOutput = await jsonDeleteServicesFromRegistryPromise;
    if (jsonDeleteServicesFromRegistryOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to delete all instances of services with name ${processName} from registry`, req, res);

    // Delete all instances of the service
    const jsonDeleteServicesOutput = await pm2Controller.pm2DeleteService(processName);
    if (jsonDeleteServicesOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to delete all instances of service with name ${processName}`, req, res);

    return gpusGeneral.buildJsonSuccessMessage(`Shutting down all instances completed`, [], req, res);
}
apiArray.push(
    {
        method: 'POST',
        handler: replyto_jsonShutdownAllInstances,
        path: 'jsonShutdownAllInstances',
        options:
        {
            public: true,
            description: 'Shuts down all instances of a service by service name (excluding sys_procmanager)',
            group: 'Process Management',
            sampleParams:
            {
                process_name: 'sys_webserverapis'
            }
        }
    }
);


async function replyto_jsonResumeAllInstances(req, res)
{
    if (req.body.process_name === undefined) return gpusGeneral.buildJsonErrorMessage(`Missing required parameter: process_name`, req, res);
    const processName = req.body.process_name;
    if (processName == 'sys_procmanager') return gpusGeneral.buildJsonErrorMessage(`Invalid request to resume all instance of process: ${processName}`, req, res);

    // Check that all instances of the service has stopped/errored
    const jsonDescribeServicesOutput = await pm2Controller.pm2Describe(processName);
    if (jsonDescribeServicesOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to describe service with name ${processName}` , req, res);
    if (jsonDescribeServicesOutput['resultset'].length <= 0) return gpusGeneral.buildJsonErrorMessage(`Resultset when descibing service with name ${processName} was empty`, req, res);
    for (const jsonInstance of jsonDescribeServicesOutput['resultset'])
    {
        const pmId = jsonInstance['pm_id'];
        const serviceStatus = jsonInstance['pm2_env']['status'];
        if (!['stopped', 'errored'].includes(serviceStatus)) return gpusGeneral.buildJsonErrorMessage(`Instance with identifier ${pmId} for service with name ${processName} is not stopped or errored`, req, res)
    }

    // Get all instances of the service from registry
    const arrayBindParamsGetServices = [];
    arrayBindParamsGetServices.push(processName);
    const sqlStmtGetServices = `
    SELECT pm_id, name
    FROM sys.registry
    WHERE name = ?
    `;
    const jsonGetServicesPromise = mySqlConnection.execMySql(sqlStmtGetServices, arrayBindParamsGetServices);
    const jsonGetServicesOutput = await jsonGetServicesPromise;
    if (jsonGetServicesOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to get services with name ${processName}`, req, res);
    if (jsonGetServicesOutput['resultset'].length <= 0) return gpusGeneral.buildJsonErrorMessage(`Resultset when getting services with name ${processName} was empty`, req, res);

    // Deregister all instances of the service
    const arrayBindParamsDeregisterServices = [];
    arrayBindParamsDeregisterServices.push(processName);
    const sqlStmtDeregisterServicesByName = `
    UPDATE sys.registry
    SET status = 'stopped'
    WHERE name = ?
    `;
    const jsonDeregisterServicesByNamePromise = mySqlConnection.execMySql(sqlStmtDeregisterServicesByName, arrayBindParamsDeregisterServices);
    const jsonDeregisterServicesByNameOutput = await jsonDeregisterServicesByNamePromise;
    if (jsonDeregisterServicesByNameOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to deregister services with name ${processName}`, req, res);

    // Restart all instances of the service
    const jsonRestartServicesOutput = await pm2Controller.pm2RestartService(processName);
    if (jsonRestartServicesOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to restart service with name ${processName}`, req, res);

    // Register all instances of the service
    const arrayBindParamsRegisterServices = [];
    arrayBindParamsRegisterServices.push(processName);
    const sqlStmtRegisterServicesByName = `
    UPDATE sys.registry
    SET status = 'online'
    WHERE name = ?
    `;
    const jsonRegisterServicesByNamePromise = mySqlConnection.execMySql(sqlStmtRegisterServicesByName, arrayBindParamsRegisterServices);
    const jsonRegisterServicesByNameOutput = await jsonRegisterServicesByNamePromise;
    if (jsonRegisterServicesByNameOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to register services with name ${processName}`, req, res);
    
    return gpusGeneral.buildJsonSuccessMessage(`All instances of service ${processName} was resumed`, [], req, res);
}
apiArray.push(
    {
        method: 'POST',
        handler: replyto_jsonResumeAllInstances,
        path: 'jsonResumeAllInstances',
        options:
        {
            public: true,
            description: 'Resumes all instances of a service by service name (excluding sys_procmanager)',
            group: 'Process Management',
            sampleParams:
            {
                process_name: 'sys_webserverapis'
            }
        }
    }
);

async function replyto_jsonStopAllInstances(req, res)
{
    if (req.body.process_name === undefined) return gpusGeneral.buildJsonErrorMessage(`Missing required parameter: process_name`, req, res);
    const processName = req.body.process_name;
    if (processName == 'sys_procmanager') return gpusGeneral.buildJsonErrorMessage(`Invalid request to stop all instances of process: ${processName}`, req, res);

    // Get all instances of the service from registry
    const arrayBindParamsGetServices = [];
    arrayBindParamsGetServices.push(processName);
    const sqlStmtGetServices = `
    SELECT pm_id, name
    FROM sys.registry
    WHERE name = ?
    `;
    const jsonGetServicesPromise = mySqlConnection.execMySql(sqlStmtGetServices, arrayBindParamsGetServices);
    const jsonGetServicesOutput = await jsonGetServicesPromise;
    if (jsonGetServicesOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to get services with name ${processName}`, req, res);
    if (jsonGetServicesOutput['resultset'].length <= 0) return gpusGeneral.buildJsonErrorMessage(`Resultset when getting services with name ${processName} was empty`, req, res);

    // Deregister all instances of the service
    const arrayBindParams = [];
    arrayBindParams.push(processName);
    const sqlStmtDeregisterServicesByName = `
    UPDATE sys.registry
    SET status = 'stopped'
    WHERE name = ?
    `;
    const jsonDeregisterServicesByNamePromise = mySqlConnection.execMySql(sqlStmtDeregisterServicesByName, arrayBindParams);
    const jsonDeregisterServicesByNameOuptut = await jsonDeregisterServicesByNamePromise;
    if (jsonDeregisterServicesByNameOuptut['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to deregister service with name ${processName}`, req, res);

    // Stop all instances of the service
    const jsonStopServicesOutput = await pm2Controller.pm2StopService(processName);
    if (jsonStopServicesOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to stop service with name ${processName}`, req, res);

    return gpusGeneral.buildJsonSuccessMessage(`All instances of service ${processName} was stopped`, [], req, res);
}
apiArray.push(
    {
        method: 'POST',
        handler: replyto_jsonStopAllInstances,
        path: 'jsonStopAllInstances',
        options:
        {
            public: true,
            description: 'Stops all instances of a service by service name (excluding sys_procmanager)',
            group: 'Process Management',
            sampleParams: 
            {
                process_name: 'sys_webserverapis'
            }
        }
    }
);

// ===========================================================================
// Current Instance
// ===========================================================================
async function replyto_jsonResumeCurrentInstance(req, res)
{
    if (req.body.process_identifier === undefined) return gpusGeneral.buildJsonErrorMessage(`Missing required parameter: process_identifier`, req, res);
    if (req.body.process_name === undefined) return gpusGeneral.buildJsonErrorMessage(`Missing required parameter: process_name`, req, res);
    const processIdentifier = req.body.process_identifier;
    const processName = req.body.process_name;
    if (processName == 'sys_procmanager') return gpusGeneral.buildJsonErrorMessage(`Invalid request to resume instance of process: ${processName}`, req, res);

    // Check that service has been stopped/errored
    const jsonDescribeServicesOutput = await pm2Controller.pm2Describe(processIdentifier);
    if (jsonDescribeServicesOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to describe service with identifier ${processIdentifier}` , req, res);
    if (jsonDescribeServicesOutput['resultset'].length <= 0) return gpusGeneral.buildJsonErrorMessage(`Resultset when descibing service with identifier ${processIdentifier} was empty`, req, res);
    const jsonCurrentInstance = jsonDescribeServicesOutput['resultset'][0];
    const serviceStatus = jsonCurrentInstance['pm2_env']['status'];
    if (!['stopped', 'errored'].includes(serviceStatus)) return gpusGeneral.buildJsonErrorMessage(`Current instance with identifier ${processIdentifier} is not stopped or errored`, req, res);

    // Get service from registry
    const arrayBindParamsGetService = [];
    arrayBindParamsGetService.push(processIdentifier);
    const sqlStmtGetService = `
    SELECT pm_id, name
    FROM sys.registry
    WHERE pm_id = ?
    `;
    const jsonGetServicePromise = mySqlConnection.execMySql(sqlStmtGetService, arrayBindParamsGetService);
    const jsonGetServiceOutput = await jsonGetServicePromise;
    if (jsonGetServiceOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to get service with identifier ${processIdentifier}`, req, res);
    if (jsonGetServiceOutput['resultset'].length <= 0) return gpusGeneral.buildJsonErrorMessage(`Resultset when getting service with identifier ${processIdentifier} was empty`, req, res);

    // Deregister service
    const arrayBindParamsDeregisterService = [];
    arrayBindParamsDeregisterService.push(processIdentifier);
    const sqlStmtDeregisterServiceById = `
    UPDATE sys.registry
    SET status = 'stopped'
    WHERE pm_id = ?
    `;
    const jsonDeregisterServiceByIdPromise = mySqlConnection.execMySql(sqlStmtDeregisterServiceById, arrayBindParamsDeregisterService);
    const jsonDeregisterServiceByIdOutput = await jsonDeregisterServiceByIdPromise;
    if (jsonDeregisterServiceByIdOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to deregister service with identifier ${processIdentifier}`, req, res);

    // Restart service
    const jsonRestartServiceOutput = await pm2Controller.pm2RestartService(processIdentifier);
    if (jsonRestartServiceOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to restart service with identifier ${processIdentifier}`, req, res);

    // Register service
    const arrayBindParamsRegisterService = [];
    arrayBindParamsRegisterService.push(processIdentifier);
    const sqlStmtRegisterServiceById = `
    UPDATE sys.registry
    SET status = 'online'
    WHERE pm_id = ?
    `;
    const jsonRegisterServiceByIdPromise = mySqlConnection.execMySql(sqlStmtRegisterServiceById, arrayBindParamsRegisterService);
    const jsonRegisterServiceByIdOutput = await jsonRegisterServiceByIdPromise;
    if (jsonRegisterServiceByIdOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to register service with identifier ${processIdentifier}`, req, res);
    
    return gpusGeneral.buildJsonSuccessMessage(`Service with identifier ${processIdentifier} was resumed`, [], req, res);
}
apiArray.push(
    {
        method: 'POST',
        handler: replyto_jsonResumeCurrentInstance,
        path: 'jsonResumeCurrentInstance',
        options:
        {
            public: true,
            description: 'Resumes a specific service instance by pm_id (excluding sys_procmanager)',
            group: 'Process Management',
            sampleParams:
            {
                process_identifier: 0
            }
        }
    }
);

async function replyto_jsonStopCurrentInstance(req, res)
{
    if (req.body.process_identifier === undefined) return gpusGeneral.buildJsonErrorMessage(`Missing required parameter: process_identifier`, req, res);
    if (req.body.process_name === undefined) return gpusGeneral.buildJsonErrorMessage(`Missing required parameter: process_name`, req, res);
    const processIdentifier = req.body.process_identifier;
    const processName = req.body.process_name;
    if (processName == 'sys_procmanager') return gpusGeneral.buildJsonErrorMessage(`Invalid request to stop instance of process: ${processName}`, req, res);

    // Get service from registry
    const arrayBindParamsGetService = [];
    arrayBindParamsGetService.push(processIdentifier);
    const sqlStmtGetService = `
    SELECT pm_id, name
    FROM sys.registry
    WHERE pm_id = ?
    `;
    const jsonGetServicePromise = mySqlConnection.execMySql(sqlStmtGetService, arrayBindParamsGetService);
    const jsonGetServiceOutput = await jsonGetServicePromise;
    if (jsonGetServiceOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to get service with identifier ${processIdentifier}`, req, res);
    if (jsonGetServiceOutput['resultset'].length <= 0) return gpusGeneral.buildJsonErrorMessage(`Resultset when getting service with identifier ${processIdentifier} was empty`, req, res);

    // Deregister service
    const arrayBindParams = [];
    arrayBindParams.push(processIdentifier);
    const sqlStmtDeregisterServiceById = `
    UPDATE sys.registry
    SET status = 'stopped'
    WHERE pm_id = ?
    `;
    const jsonDeregisterServiceByIdPromise = mySqlConnection.execMySql(sqlStmtDeregisterServiceById, arrayBindParams);
    const jsonDeregisterServiceByIdOutput = await jsonDeregisterServiceByIdPromise;
    if (jsonDeregisterServiceByIdOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to deregister service with identifier ${processIdentifier}`, req, res);

    // Stop service
    const jsonStopServiceOutput = await pm2Controller.pm2StopService(processIdentifier);
    if (jsonStopServiceOutput['status'] != 'SUCCESS') return gpusGeneral.buildJsonErrorMessage(`Failed to stop service with identifier ${processIdentifier}`, req, res);

    return gpusGeneral.buildJsonSuccessMessage(`Service with identifier ${processIdentifier} was stopped`, [], req, res);
}
apiArray.push(
    {
        method: 'POST',
        handler: replyto_jsonStopCurrentInstance,
        path: 'jsonStopCurrentInstance',
        options:
        {
            public: true,
            description: 'Stops a specific service instance by pm_id (excluding sys_procmanager)',
            group: 'Process Management',
            sampleParams: 
            {
                process_identifier: 0
            }
        }
    }
);
