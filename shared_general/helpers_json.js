function parseJsonSafe(jsonObj)
{
    if (typeof jsonObj == 'object') return jsonObj;
    if (typeof jsonObj != 'string') return null;

    try {
        const parsedJson = JSON.parse(jsonObj);
        return parsedJson;
    } catch (err) {
        return null;
    }
}

module.exports =
{
    parseJsonSafe: parseJsonSafe,
};