const helpersJsonResponse = require('./helpers_jsonresponse.js');
const helpersRouter = require('./helpers_router.js');
const helpersNetwork = require('./helpers_network.js');
const helpersCrypto = require('./helpers_crypto.js');
const helpersHttp = require('./helpers_http.js');

module.exports = 
{
    buildJsonInvalidParameters: helpersJsonResponse.buildJsonInvalidParameters,
    buildJsonErrorMessage: helpersJsonResponse.buildJsonErrorMessage,
    buildJsonSuccessMessage: helpersJsonResponse.buildJsonSuccessMessage,
    loadAppRouterBase: helpersRouter.loadAppRouterBase,
    loadAppRouterProc: helpersRouter.loadAppRouterProc,
    loadErrorLoadAppRouter: helpersRouter.loadErrorLoadAppRouter,
    loadErrorResourceNotFound: helpersRouter.loadErrorResourceNotFound,
    loadStaticPathNotFoundRedirect: helpersRouter.loadStaticPathNotFoundRedirect,
    identifyLoopbackNetworkAddress: helpersNetwork.identifyLoopbackNetworkAddress,
    identifyExternalNetworkAddress: helpersNetwork.identifyExternalNetworkAddress,
    cryptoGenerateUUID: helpersCrypto.cryptoGenerateUUID,
    cryptoRandomBytes: helpersCrypto.cryptoRandomBytes,
    cryptoHashMessage256Bit: helpersCrypto.cryptoHashMessage256Bit,
    cryptoEncryptCardInfoAES: helpersCrypto.cryptoEncryptCardInfoAES,
    cryptoDecryptCardInfoAES: helpersCrypto.cryptoDecryptCardInfoAES,
    performGetHttpRequest: helpersHttp.performGetHttpRequest,
    performPostHttpRequest: helpersHttp.performPostHttpRequest,
    performPutHttpRequest: helpersHttp.performPutHttpRequest,
};