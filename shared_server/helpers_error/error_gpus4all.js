/**
 * Superclass for errors occurring during some operation for Gpus4All
 * Note that these errors should only pertain to wrappers and adapters.
 * Meaning, this class and any subclass of it should only be used and called within wrappers_* and adapters_* and nowhere else.
 */

class Gpus4AllError
{
    static getClassName()
    {
        return 'Gpus4AllError';
    }

    static buildJsonError(errorClassType, errorType, errorMessage)
    {
        const jsonError = {};
        jsonError['status'] = 'ERROR';
        jsonError['message'] = `[${errorClassType}] ${errorType}: ${errorMessage}`;
        jsonError['resultset'] = null;
        jsonError['error_class_type'] = errorClassType;
        jsonError['error_type'] = errorType;
        return jsonError;
    }

    static buildJsonErrorLog(errorClassType, errorLog)
    {
        const errorType = 'MULTIPLE';
        const arryErrorMessage = errorLog.map((jsonError) => `${jsonError['error_type']}: ${jsonError['message']}`);
        const constructedErrorMessage = arryErrorMessage.join(`\n`);

        const jsonError = {};
        jsonError['status'] = 'ERROR';
        jsonError['message'] = `[${errorClassType}]\n${constructedErrorMessage}`;
        jsonError['resultset'] = null;
        jsonError['error_class_type'] = errorClassType;
        jsonError['error_type'] = errorType;
        return jsonError;
    }

    static buildJsonErrorGeneral()
    {
        const errorClassType = Gpus4AllError.getClassName();
        const errorType = 'General';

        const jsonError = {};
        jsonError['status'] = 'ERROR';
        jsonError['message'] = `[${errorClassType}] ${errorType}: An error occurred`;
        jsonError['resultset'] = null;
        jsonError['error_class_type'] = errorClassType;
        jsonError['error_type'] = errorType;
        return jsonError;
    }
}

module.exports = 
{
    Gpus4AllError
};