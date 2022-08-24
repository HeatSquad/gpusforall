const helpersDate = require('./helpers_date.js');
const helpersJson = require('./helpers_json.js');

module.exports = 
{
    getCurrentDateLocalTime: helpersDate.getCurrentDateLocalTime,
    parseJsonSafe: helpersJson.parseJsonSafe,
};