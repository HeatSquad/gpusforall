const { Gpus4AllError } = require('./error_gpus4all.js');

class RedisCacheError extends Gpus4AllError
{
    static getClassName()
    {
        return 'RedisCacheError';
    }

    static {
        this.ErrorTypesEnum = 
        {
            "HOST_UNDEFINED": "Redis client host is undefined",
            "PORT_UNDEFINED": "Redis client port is undefined",
            "PASSWORD_UNDEFINED": "Redis client password is undefined",
            "ACTIVE_CLIENT_NOT_FOUND": "Redis client doesn't exist",
        }
    }

    static buildJsonError(errorType)
    {
        const errorClassType = RedisCacheError.getClassName();
        const errorMessage = this.ErrorTypesEnum[errorType];
        return super.buildJsonError(errorClassType, errorType, errorMessage);
    }

    static buildJsonErrorLog(arrayJsonError)
    {
        const errorClassType = RedisCacheError.getClassName();
        const errorLog = arrayJsonError.map((error) => {
            const errorType = error['error_type'];
            const messageAppend = error['error_msg_append'];
            const errorMessage = this.ErrorTypesEnum[errorType];
            
            let completeErrorMessage = '';
            if (messageAppend === undefined) completeErrorMessage = errorMessage;
            if (messageAppend !== undefined) completeErrorMessage = `${errorMessage} - ${messageAppend}`;
            return { error_type: errorType, message: completeErrorMessage };
        });
        return super.buildJsonErrorLog(errorClassType, errorLog);
    }

    static buildJsonErrorGeneral()
    {
        return super.buildJsonErrorGeneral();
    }
}

module.exports =
{
    RedisCacheError
}