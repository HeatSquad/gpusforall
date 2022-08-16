const path = require('path');
const config = require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
if (config.error) {
    console.error('Failed to load environmental variables');
    throw config.error;
}
const scriptName = path.basename(__filename);

const { identifyLoopbackNetworkAddress, identifyExternalNetworkAddress  } = require('../shared_server/general.js');
const pm2Controller = require('../shared_server/wrappers_pm2.js');

(async function()
{
    // Fetch ecosystem json
    let jsonApps = null;
    if (process.env.NODE_ENV === 'development') jsonApps = require('./ecosystem_dev.json');
    if (process.env.NODE_ENV === 'production') jsonApps = require('./ecosystem_prod.json');
    if (jsonApps == null)
    {
        console.error('Failed to load ecosystem json');
        process.exit(2);
    }
    const apps = jsonApps['apps'];

    // Identify network address
    let jsonNetworkAddress = null;
    if (process.env.NODE_ENV === 'development') jsonNetworkAddress = identifyLoopbackNetworkAddress();
    if (process.env.NODE_ENV === 'production') jsonNetworkAddress = identifyExternalNetworkAddress();
    if (jsonNetworkAddress == null)
    {
        console.error('Failed to identify network address');
        process.exit(2);
    }
    const ipAddress = jsonNetworkAddress['address'];
    const subnetMask = jsonNetworkAddress['netmask'];

    // Connect to/spawn pm2
    const jsonConnectToPm2Output = await pm2Controller.pm2Connect();
    if (jsonConnectToPm2Output['status'] != 'SUCCESS')
    {
        console.error(jsonConnectToPm2Output['message']);
        process.exit(2);
    }
    console.log(jsonConnectToPm2Output['message']);

    // Launch the bus to listen to services that have disconnected by a service other than PM2
    // const jsonLaunchBusOutput = await pm2Controller.pm2LaunchBus();
    // if (jsonLaunchBusOutput['status'] != 'SUCCESS')
    // {
    //     console.error(jsonLaunchBusOutput['message']);
    //     process.exit(2);
    // }
    // if (jsonLaunchBusOutput['resultset'].length <= 0)
    // {
    //     console.error(`Bus acting as axon sub emitter doesn't exist`);
    //     process.exit(2);
    // }
    // const bus = jsonLaunchBusOutput['resultset'][0];
    // bus.on('process:msg', (packet) => {
    //     console.log(packet);
    // });

    // Start up child services on each port and error handle
    // NOTE: sys_procmanager is included in the ecosystem
    const lookupServices = {};
    const failedServicesOnStartup = [];
    for (const options of apps)
    {
        const name = options['name'];
        const port = options['env']['PORT'];
        if (lookupServices[name] !== undefined)
        {
            console.error(`Duplicate service in ecosystem file: ${name}`);
            process.exit(2);
        }
        const jsonStartServiceOutput = await pm2Controller.pm2StartService(options);
        if (jsonStartServiceOutput['status'] != 'SUCCESS')
        {
            failedServicesOnStartup.push({ name: name, port: port, error: jsonStartServiceOutput['message'] });
            continue;
        }
        if (jsonStartServiceOutput['resultset'].length <= 0)
        {
            failedServicesOnStartup.push({ name: name, port: port, error: `PM2 process object doesn't exist` });
            continue;
        }
        const proc = jsonStartServiceOutput['resultset'][0];
        const pmId = proc['pm2_env']['pm_id'];
        const status = proc['pm2_env']['status'];
        lookupServices[name] = {};
        lookupServices[name]['pm_id'] = pmId;
        lookupServices[name]['name'] = name;
        lookupServices[name]['ipaddress'] = ipAddress;
        lookupServices[name]['subnet_mask'] = subnetMask;
        lookupServices[name]['port'] = port;
        lookupServices[name]['status'] = status;
        console.log(`${name} succesfully started on port [${port}]`);
    }
    console.log('\nWARNING: Failed to start the following services:');
    for (const service of failedServicesOnStartup)
    {
        console.log(`\n\t${service['name']} on port [${service['port']}]\t\t${service['error']}`);
    }

    // TODO: For each started service, register them to registry

    pm2Controller.pm2Disconnect();
})();
