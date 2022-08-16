const os = require('os');
const networkInterfaces = os.networkInterfaces();

function identifyLoopbackNetworkAddress()
{
    let jsonIpv4Address = null;
    for (const netInterface of Object.keys(networkInterfaces))
    {
        const arrayNetworkAddresses = networkInterfaces[netInterface];
        const matchedAddress = arrayNetworkAddresses.filter((jsonAddress) => {
            const familyV4Value = (typeof jsonAddress.family === 'string') ? 'IPv4': 4; // 'IPv4 if Node ver. <=17, 4 or 6 if Node ver. >18'
            return jsonAddress.internal && jsonAddress.family === familyV4Value;
        });
        if (matchedAddress.length > 0)
        {
            jsonIpv4Address = matchedAddress[0];
            break;
        }
    }
    return jsonIpv4Address;
}

function identifyExternalNetworkAddress()
{
    let jsonIpv4Address = null;
    for (const netInterface of Object.keys(networkInterfaces))
    {
        const arrayNetworkAddresses = networkInterfaces[netInterface];
        const matchedAddress = arrayNetworkAddresses.filter((jsonAddress) => {
            const familyV4Value = (typeof jsonAddress.family === 'string') ? 'IPv4': 4; // 'IPv4 if Node ver. <=17, 4 or 6 if Node ver. >18'
            return !jsonAddress.internal && jsonAddress.family === familyV4Value;
        });
        if (matchedAddress.length > 0)
        {
            jsonIpv4Address = matchedAddress[0];
            break;
        }
    }
    return jsonIpv4Address;
}

module.exports =
{
    identifyLoopbackNetworkAddress: identifyLoopbackNetworkAddress,
    identifyExternalNetworkAddress: identifyExternalNetworkAddress,
}