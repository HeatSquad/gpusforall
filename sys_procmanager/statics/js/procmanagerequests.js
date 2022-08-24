var currentServiceViewed = null;

window.onload = function(e)
{
    document.getElementById('button-ecosystem-restart').onclick = () => { restartEcosystem(); };
    document.getElementById('button-ecosystem-shutdown').onclick = () => { shutdownEcosystem(); };
    document.getElementById('button-ecosystem-resume').onclick = () => { resumeEcosystem(); };
    document.getElementById('button-ecosystem-stop').onclick = () => { stopEcosystem(); };

    document.getElementById('button-service-restart-all-instances').onclick = () => { restartAllInstances(); };
    document.getElementById('button-service-shutdown-all-instances').onclick = () => { shutdownAllInstances(); };
    document.getElementById('button-service-resume-all-instances').onclick = () => { resumeAllInstances(); };
    document.getElementById('button-service-stop-all-instances').onclick = () => { stopAllInstances(); };
    document.getElementById('button-service-resume-current-instance').onclick = () => { resumeCurrentInstance(); };
    document.getElementById('button-service-stop-current-instance').onclick = () => { stopCurrentInstance(); };

    document.getElementById('button-refresh').onclick = () => { onRefreshButtonClicked(); };
    // TEMP =========================
    document.getElementById('button-heartbeat-registry').onclick = () => { onHeartbeatRegistryClicked(); };
    document.getElementById('button-heartbeat-cache').onclick = () => { onHeartbeatCacheClicked(); };
    document.getElementById('button-flush-cache').onclick = () => { onFlushCacheClicked(); };
    // ===============================
    buildServices();
    fetchNetworkInformation();
}

// ============================================================================
// Functions 
// ============================================================================
function buildServices()
{
    appendStatusMessage('Fetching active services...');

    fetch('/apis/proc/jsonFetchAllServices', {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (!data['resultset'] || data['resultset'].length <= 0)
            {
                document.getElementById('error-feedback-list-services').style.display = 'block';
                return;
            }

            const table = document.getElementById('table-services');
            table.replaceChildren();
            const trHeader = document.createElement('tr');
            const lookupHeaderPositions = {
                '0': 'pm_id',
                '1': 'Name',
                '2': 'pid',
                '3': 'Instances',
                '4': 'Port',
                '5': 'Uptime',
                '6': 'Cpu',
                '7': 'Mem',
                '8': 'Mode',
                '9': 'Status',
                '10': 'Actions'
            }
            const numHeaderCols = Object.entries(lookupHeaderPositions).length;
            for (let i = 0; i < numHeaderCols; i++)
            {
                const thHeaderCol = document.createElement('th');
                thHeaderCol.innerHTML = lookupHeaderPositions[i.toString()];
                trHeader.appendChild(thHeaderCol);
            }
            table.appendChild(trHeader);

            for (const jsonService of data['resultset'])
            {
                jsonService['pm_id'] = (jsonService['pm_id'] !== undefined && jsonService['pm_id'] != null) ? jsonService['pm_id'] : 'N/A';
                jsonService['name'] = (jsonService['name'] !== undefined && jsonService['name'] != null) ? jsonService['name'] : 'N/A';
                jsonService['pid'] = (jsonService['pid'] !== undefined && jsonService['pid'] != null) ? jsonService['pid'] : 'N/A';
                jsonService['instances'] = (jsonService['instances'] !== undefined && jsonService['instances'] != null) ? jsonService['instances'] : 'N/A';
                jsonService['port'] = (jsonService['port'] !== undefined && jsonService['port'] != null) ? jsonService['port'] : 'N/A';
                jsonService['uptime'] = (jsonService['uptime'] !== undefined && jsonService['uptime'] != null) ? jsonService['uptime'] : 'N/A';
                jsonService['cpu'] = (jsonService['cpu'] !== undefined && jsonService['cpu'] != null) ? jsonService['cpu'] : 'N/A';
                jsonService['mem'] = (jsonService['mem'] !== undefined && jsonService['mem'] != null) ? jsonService['mem'] : 'N/A';
                jsonService['mode'] = (jsonService['mode'] !== undefined && jsonService['mode'] != null) ? jsonService['mode'] : 'N/A';
                jsonService['status'] = (jsonService['status'] !== undefined && jsonService['status'] != null) ? jsonService['status'] : 'N/A';

                const trData = document.createElement('tr');
                for (let i = 0; i < numHeaderCols; i++)
                {
                    const tdData = document.createElement('td');
                    if (i === 0) tdData.innerHTML = jsonService['pm_id'];
                    if (i === 1) tdData.innerHTML = jsonService['name'];
                    if (i === 2) tdData.innerHTML = jsonService['pid'];
                    if (i === 3) tdData.innerHTML = jsonService['instances'];
                    if (i === 4) tdData.innerHTML = jsonService['port'];
                    if (i === 5) tdData.innerHTML = jsonService['uptime'];
                    if (i === 6) tdData.innerHTML = jsonService['cpu'];
                    if (i === 7) tdData.innerHTML = jsonService['mem'];
                    if (i === 8) tdData.innerHTML = jsonService['mode'];
                    if (i === 9) tdData.innerHTML = jsonService['status'];
                    if (i === 10)
                    {
                        const actionButton = document.createElement('button');
                        actionButton.setAttribute('class', 'p-button txt-white bg-dark');
                        actionButton.innerHTML = 'View';
                        actionButton.onclick = () => {
                            onViewButtonClicked(jsonService);
                        }
                        tdData.appendChild(actionButton);
                    }
                    trData.appendChild(tdData);
                }
                // Determine row bg color
                if (jsonService['status'] === 'online') trData.style.backgroundColor = '#e8f4ea';
                if (jsonService['status'] === 'stopping') trData.style.backgroundColor = '#F8F1AE';
                if (jsonService['status'] === 'stopped') trData.style.backgroundColor = '#FAC898';
                if (jsonService['status'] === 'launching') trData.style.backgroundColor = '#A7C7E7';
                if (jsonService['status'] === 'errored') trData.style.backgroundColor = '#ffb2ae';
                if (jsonService['status'] === 'one-launch-status') trData.style.backgroundColor = '#efefef';
                table.appendChild(trData);
            }
            appendStatusMessage('Fetched all services.');
        })
        .catch((err) => {
            console.error(err);
            appendStatusMessageError('Failed to fetching active services');
        });
}

function fetchNetworkInformation()
{
    appendStatusMessage('Fetching network information...');

    fetch('/apis/proc/jsonFetchCurrentNetworkAddress', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (!data['resultset'] || data['resultset'].length <= 0)
        {
            appendStatusMessageError('No network information was fetched.');
            return;
        }

        const jsonNetworkAddress = data['resultset'][0];
        const ipAddress = jsonNetworkAddress['address'];
        const subnetMask = jsonNetworkAddress['netmask'];

        document.getElementById('ipaddress-display').innerHTML = ipAddress;
        document.getElementById('subnet-display').innerHTML = subnetMask;
        appendStatusMessage('Fetched network information');
    })
    .catch((err) => {
        console.error(err);
        appendStatusMessageError('Failed to fetching network information');
    });
}

function performHttpProcManagerRequest(apiEndpoint, httpMethod, loadingStatusMsg, errStatusMsg, jsonBody)
{
    appendStatusMessage(loadingStatusMsg);

    const options =
    {
        method: httpMethod,
        headers: { 'Content-Type': 'application/json' }
    };
    if (jsonBody !== undefined && jsonBody != null && typeof jsonBody === 'object')
    {
        options['body'] = JSON.stringify(jsonBody);
    }

    fetch(apiEndpoint, options)
        .then(response => response.json())
        .then(data => {
            if (data['status'] != 'SUCCESS') return appendStatusMessageError(data['message']);
            if (data['resultset'].length > 0)
            {
                const jsonIncompleteStartupError = data['resultset'][0];
                const incompleteStartupError = jsonIncompleteStartupError['error'];
                appendStatusMessageError(incompleteStartupError);
            }
            else
            {
                appendStatusMessage(data['message']);
            }

            buildServices();
            resetServiceDetails();
        })
        .catch((err) => {
            console.error(err);
            appendStatusMessageError(errStatusMsg);
        });
}

// ============================================================================
// Event Handlers
// ============================================================================
function onRefreshButtonClicked()
{
    buildServices();
}

function onViewButtonClicked(jsonService)
{
    currentServiceViewed = null;

    console.log('actionButtonClicked - ', jsonService['pm_id']);
    document.getElementById('card-service-details').style.visibility = 'visible';

    // Populate info
    document.getElementById('info-pmid').innerHTML = jsonService['pm_id'];
    document.getElementById('info-name').innerHTML = jsonService['name'];
    document.getElementById('info-pid').innerHTML = jsonService['pid'];
    document.getElementById('info-instances').innerHTML = jsonService['instances'];
    document.getElementById('info-port').innerHTML = jsonService['port'];
    document.getElementById('info-uptime').innerHTML = jsonService['uptime'];
    document.getElementById('info-cpu').innerHTML = jsonService['cpu'];
    document.getElementById('info-mem').innerHTML = jsonService['mem'];
    document.getElementById('info-mode').innerHTML = jsonService['mode'];
    document.getElementById('info-status').innerHTML = jsonService['status'];
    document.getElementById('info-status').style.color = '';
    if (jsonService['status'] === 'online') document.getElementById('info-status').style.color = 'green';
    if (jsonService['status'] === 'stopping') document.getElementById('info-status').style.color = '#FFD700';
    if (jsonService['status'] === 'stopped') document.getElementById('info-status').style.color = 'orange';
    if (jsonService['status'] === 'launching') document.getElementById('info-status').style.color = 'blue';
    if (jsonService['status'] === 'errored') document.getElementById('info-status').style.color = 'red';
    if (jsonService['status'] === 'one-launch-status') document.getElementById('info-status').style.color = '#666666';

    currentServiceViewed = jsonService;
}

function resetServiceDetails()
{
    currentServiceViewed = null;
    document.getElementById('card-service-details').style.visibility = 'hidden';
}

// TEMP: REMOVE LATER =========================================================
function onHeartbeatRegistryClicked()
{
    console.log('onHeartbeatRegistryClicked');
    const apiEndpoint = '/apis/proc/jsonHeartbeatRegistry';
    const httpMethod = 'POST';
    const loadingStatusMsg = 'Heartbeat Registry...';
    const errStatusMsg = 'Failed to send heartbeat for registry.';
    performHttpProcManagerRequest(apiEndpoint, httpMethod, loadingStatusMsg, errStatusMsg);
}
function onHeartbeatCacheClicked()
{
    console.log('onHeartbeatCacheClicked');
    const apiEndpoint = '/apis/proc/jsonHeartbeatCache';
    const httpMethod = 'POST';
    const loadingStatusMsg = 'Heartbeat Cache...';
    const errStatusMsg = 'Failed to send heartbeat for cache.';
    performHttpProcManagerRequest(apiEndpoint, httpMethod, loadingStatusMsg, errStatusMsg);
}
function onFlushCacheClicked()
{
    console.log('onFlushCacheClicked');
    const apiEndpoint = '/apis/proc/jsonFlushCache';
    const httpMethod = 'POST';
    const loadingStatusMsg = 'Flushing Cache...';
    const errStatusMsg = 'Failed to flush cache.';
    performHttpProcManagerRequest(apiEndpoint, httpMethod, loadingStatusMsg, errStatusMsg);
}
// ============================================================================

// ============================================================================
// Ecosystem
// ============================================================================
function restartEcosystem()
{
    const apiEndpoint = '/apis/proc/jsonRestartEcosystem';
    const httpMethod = 'POST';
    const loadingStatusMsg = 'Restarting ecosystem...';
    const errStatusMsg = 'Failed to restart ecosystem.';
    performHttpProcManagerRequest(apiEndpoint, httpMethod, loadingStatusMsg, errStatusMsg);
}
function shutdownEcosystem()
{
    const apiEndpoint = '/apis/proc/jsonShutdownEcosystem';
    const httpMethod = 'POST';
    const loadingStatusMsg = 'Shutting down ecosystem...';
    const errStatusMsg = 'Failed to shut down ecosystem.';
    performHttpProcManagerRequest(apiEndpoint, httpMethod, loadingStatusMsg, errStatusMsg);
}
function resumeEcosystem()
{
    const apiEndpoint = '/apis/proc/jsonResumeEcosystem';
    const httpMethod = 'POST';
    const loadingStatusMsg = 'Resuming ecosystem...';
    const errStatusMsg = 'Failed to resume ecosystem.';
    performHttpProcManagerRequest(apiEndpoint, httpMethod, loadingStatusMsg, errStatusMsg);
}
function stopEcosystem()
{
    const apiEndpoint = '/apis/proc/jsonStopEcosystem';
    const httpMethod = 'POST';
    const loadingStatusMsg = 'Stopping ecosystem...';
    const errStatusMsg = 'Failed to stop ecosystem.';
    performHttpProcManagerRequest(apiEndpoint, httpMethod, loadingStatusMsg, errStatusMsg);
}

// ============================================================================
// All Instances
// ============================================================================
function restartAllInstances()
{
    if (currentServiceViewed == null) return appendStatusMessageError('No service was selected.');
    const name = currentServiceViewed['name'];

    const apiEndpoint = '/apis/proc/jsonRestartAllInstances';
    const httpMethod = 'POST';
    const loadingStatusMsg = 'Restarting all instances...';
    const errStatusMsg = 'Failed to restart all instances.';
    const jsonBody = { process_name: name };
    performHttpProcManagerRequest(apiEndpoint, httpMethod, loadingStatusMsg, errStatusMsg, jsonBody);
}
function shutdownAllInstances()
{
    if (currentServiceViewed == null) return appendStatusMessageError('No service was selected.');
    const name = currentServiceViewed['name'];

    const apiEndpoint = '/apis/proc/jsonShutdownAllInstances';
    const httpMethod = 'POST';
    const loadingStatusMsg = 'Shutting down all instances...';
    const errStatusMsg = 'Failed to shut down all instances.';
    const jsonBody = { process_name: name };
    performHttpProcManagerRequest(apiEndpoint, httpMethod, loadingStatusMsg, errStatusMsg, jsonBody);
}
function resumeAllInstances()
{
    if (currentServiceViewed == null) return appendStatusMessageError('No service was selected.');
    const name = currentServiceViewed['name'];

    const apiEndpoint = '/apis/proc/jsonResumeAllInstances';
    const httpMethod = 'POST';
    const loadingStatusMsg = 'Resumming all instances...';
    const errStatusMsg = 'Failed to resume all instances.';
    const jsonBody = { process_name: name };
    performHttpProcManagerRequest(apiEndpoint, httpMethod, loadingStatusMsg, errStatusMsg, jsonBody);
}
function stopAllInstances()
{
    if (currentServiceViewed == null) return appendStatusMessageError('No service was selected.');
    const name = currentServiceViewed['name'];

    const apiEndpoint = '/apis/proc/jsonStopAllInstances';
    const httpMethod = 'POST';
    const loadingStatusMsg = 'Stopping all instances...';
    const errStatusMsg = 'Failed to stop all instances.';
    const jsonBody = { process_name: name };
    performHttpProcManagerRequest(apiEndpoint, httpMethod, loadingStatusMsg, errStatusMsg, jsonBody);
}

// ============================================================================
// Current Instance
// ============================================================================
function resumeCurrentInstance()
{
    if (currentServiceViewed == null) return appendStatusMessageError('No service was selected.');
    const processIdentifier = currentServiceViewed['pm_id'];
    const name = currentServiceViewed['name'];

    const apiEndpoint = '/apis/proc/jsonResumeCurrentInstance';
    const httpMethod = 'POST';
    const loadingStatusMsg = 'Resuming current instance...';
    const errStatusMsg = 'Failed to resume current instance.';
    const jsonBody = { process_identifier: processIdentifier, process_name: name };
    performHttpProcManagerRequest(apiEndpoint, httpMethod, loadingStatusMsg, errStatusMsg, jsonBody);
}
function stopCurrentInstance()
{
    if (currentServiceViewed == null) return appendStatusMessageError('No service was selected.');
    const processIdentifier = currentServiceViewed['pm_id'];
    const name = currentServiceViewed['name'];

    const apiEndpoint = '/apis/proc/jsonStopCurrentInstance';
    const httpMethod = 'POST';
    const loadingStatusMsg = 'Stopping current instance...';
    const errStatusMsg = 'Failed to stop current instance.';
    const jsonBody = { process_identifier: processIdentifier, process_name: name };
    performHttpProcManagerRequest(apiEndpoint, httpMethod, loadingStatusMsg, errStatusMsg, jsonBody);
}

// ============================================================================
// Status Log Functions
// ============================================================================
function appendStatusMessage(message)
{
    resolveStatusOverflow();
    const sidebar = document.getElementById('proc-sidebar-statuses');
    const div = document.createElement('div');
    const messageHtml = document.createElement('p');
    const dateHtml = document.createElement('p');

    messageHtml.innerHTML = message;
    dateHtml.innerHTML = getCurrentDateLocalTime();
    div.setAttribute('class', 'py-1');
    div.appendChild(messageHtml);
    div.appendChild(dateHtml);
    sidebar.appendChild(div);
}
function appendStatusMessageSuccess(message)
{
    resolveStatusOverflow();
    const sidebar = document.getElementById('proc-sidebar-statuses');
    const div = document.createElement('div');
    const messageHtml = document.createElement('p');
    const dateHtml = document.createElement('p');

    messageHtml.innerHTML = message;
    messageHtml.setAttribute('class', 'txt-success');
    dateHtml.innerHTML = getCurrentDateLocalTime();
    div.setAttribute('class', 'py-1');
    div.appendChild(messageHtml);
    div.appendChild(dateHtml);
    sidebar.appendChild(div);
}
function appendStatusMessageWarning(message)
{
    resolveStatusOverflow();
    const sidebar = document.getElementById('proc-sidebar-statuses');
    const div = document.createElement('div');
    const messageHtml = document.createElement('p');
    const dateHtml = document.createElement('p');

    messageHtml.innerHTML = message;
    messageHtml.setAttribute('class', 'txt-warning');
    dateHtml.innerHTML = getCurrentDateLocalTime();
    div.setAttribute('class', 'py-1');
    div.appendChild(messageHtml);
    div.appendChild(dateHtml);
    sidebar.appendChild(div);
}
function appendStatusMessageError(message)
{
    resolveStatusOverflow();
    const sidebar = document.getElementById('proc-sidebar-statuses');
    const div = document.createElement('div');
    const messageHtml = document.createElement('p');
    const dateHtml = document.createElement('p');

    messageHtml.innerHTML = message;
    messageHtml.setAttribute('class', 'txt-danger');
    dateHtml.innerHTML = getCurrentDateLocalTime();
    div.setAttribute('class', 'py-1');
    div.appendChild(messageHtml);
    div.appendChild(dateHtml);
    sidebar.appendChild(div);
}
function resolveStatusOverflow()
{
    const sidebar = document.getElementById('proc-sidebar-statuses');
    const numChildren = sidebar.children.length;
    if (numChildren + 1 > 20)
    {
        sidebar.removeChild(sidebar.children[0]);
    }
}

function getCurrentDateLocalTime()
{
    const dateObj = new Date();
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const seconds = dateObj.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}