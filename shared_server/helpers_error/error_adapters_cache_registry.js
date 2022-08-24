const { Gpus4AllError } = require('./error_gpus4all.js');

class CacheRegistryAdapterError extends Gpus4AllError
{
    static getClassName()
    {
        return 'CacheRegistryAdapterError';
    }

    static {
        this.ErrorTypesEnum = 
        {
            "ECOSYSTEM_NOT_FOUND": "Ecosystem file was not found",
            "HMSET_FAILED": "Redis operation HMSET failed",
            "HEXISTS_FAILED": "Redis operation HEXISTS failed",
            "HEXISTS_FIELD_NOT_FOUND": "Redis operation HEXISTS field not found",
            "HDEL_FAILED": "Redis operation HDEL failed",
            "HDEL_UNEXPECTED_ERROR": "Redis operation HDEL unexpected error occurred",
            "HGETALL_FAILED": "Redis operation HGETALL failed",
            "DEL_FAILED": "Redis operation DEL failed"
        }
    }

    static buildJsonError(errorType)
    {
        const errorClassType = CacheRegistryAdapterError.getClassName();
        const errorMessage = this.ErrorTypesEnum[errorType];
        return super.buildJsonError(errorClassType, errorType, errorMessage);
    }

    static buildJsonErrorLog(arrayJsonError)
    {
        const errorClassType = CacheRegistryAdapterError.getClassName();
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
    CacheRegistryAdapterError
}