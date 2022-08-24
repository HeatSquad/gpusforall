const { Gpus4AllError } = require('./error_gpus4all.js');

class MySqlDbError extends Gpus4AllError
{
    static getClassName()
    {
        return 'MySqlDbError';
    }

    static {
        this.ErrorTypesEnum = 
        {
            "HOST_UNDEFINED": "MySQL host is undefined",
            "PORT_UNDEFINED": "MySQL port is undefined",
            "USER_UNDEFINED": "MySQL user is undefined",
            "PASSWORD_UNDEFINED": "MySQL password is undefined",
            "DATABASE_UNDEFINED": "MySQL database is undefined",
            "CONNECTION_LIMIT_UNDEFINED": "MySQL connection limit is undefined",
            "QUEUE_LIMIT_UNDEFINED": "MySQL queue limit is undefined",
            "WAIT_CONNECTIONS_UNDEFINED": "MySQL wait for connections is undefined",
            "ACTIVE_DB_NOT_FOUND": "Active db name was not found in the pool",
            "CLOSING_POOL_CONNECTIONS_FAILED": "Closing all connections in the pool failed"
        }
    }

    static buildJsonError(errorType)
    {
        const errorClassType = MySqlDbError.getClassName();
        const errorMessage = this.ErrorTypesEnum[errorType];
        return super.buildJsonError(errorClassType, errorType, errorMessage);
    }

    static buildJsonErrorLog(arrayJsonError)
    {
        const errorClassType = MySqlDbError.getClassName();
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
    MySqlDbError
}