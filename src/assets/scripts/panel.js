// The following functions need to be implemented by each panel separately:
// init(void) -> Actions that need to be taken during startup.
// apiLoad(void) -> loads the data and populates the fields, respectively.
// apiSave(void) -> Triggered when the save button is called, and saves the changed values.

var ALL_INPUT_TYPES = 'input,textarea,select';

/**
 * What happens when the window is loaded.
 */
window.onload = () => {
    init();
    document.getElementById('sync').onclick = () => {
        setSync(false);
        apiMeta(false)
    };
    apiMeta(true);
};

/**
 * AJAX: Get all the channels, roles and permissions.
 * @param {boolean} start True if cache can be used - enabling this also loads the rest of the data.
 */
function apiMeta(start) {
    let url = start ? '/ep/meta/' : '/ep/meta/refresh';
    genericAjaxRequest('GET', url, null, 'load metadata', (request) => {
        let status = request.status;
        if (status == 200) {
            // Load in the available settings.
            let json = JSON.parse(request.responseText);
            let selects = document.getElementsByTagName('select');
            for (let select of selects) {
                // For every dropdown, populate it with the correct data.
                let type = select.dataset.type;
                let toAdd = [];
                // Give it the correct data to add.
                switch (type) {
                    case 'channel':
                        toAdd = json.channels;
                        break;
                    case 'role':
                        toAdd = json.roles;
                        break;
                    case 'permission':
                        toAdd = json.permissions;
                        break;
                }
                // Add the options.
                for (let add of toAdd) {
                    let option = document.createElement('option');
                    option.classList.add('option');
                    option.value = add.id;
                    option.innerText = add.name;
                    select.add(option);
                }
            }
            if (start) {
                // Load the data.
                apiLoad();
                setAllInputs(true);
            } else {
                toastSuccess('Refreshed all entities.');
                setSync(true);
            }
        } else {
            toastError('Error getting channels, roles and permissions: ' + status);
        }
    }, () => setSync(true));
}

/**
 * Performs an AJAX request.
 * @param {string} method The HTTP method.
 * @param {string} url The URL.
 * @param {object} body The body. Can be null.
 * @param {string} task The task to print.
 * @param {Function} success The success callback.
 * @param {Function} error The error callback.
 */
function genericAjaxRequest(method, url, body, task, success, error) {
    let request = new XMLHttpRequest();
    request.open(method, url);
    request.onreadystatechange = function() {
        // Wait for the request to complete.
        if (request.readyState == XMLHttpRequest.DONE) {
            switch (request.status) {
                case 400:
                    toastError(`Could not ${task}. Did you provide invalid data?`);
                    error();
                    break;
                case 401:
                    toastError(`Could not ${task}, you are not logged in. Please refresh the page and log in.`);
                    error();
                    break;
                case 403:
                    toastError(`Could not ${task}, you cannot perform this action on this server.`);
                    error();
                    break;
                case 404:
                    toastError(`Could not ${task}, as the resource could not be found.`);
                    error();
                    break;
                case 429:
                    toastError(`Could not ${task}, you are sending too many requests.`);
                    error();
                    break;
                default:
                    success(request);
            }
        }
    }
    if (body != null) {
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify(body));
    } else {
        request.send();
    }
}

/**
 * Toggles the save button.
 */
function saveButton() {
    let button = document.getElementById('save');
    let changed = document.getElementsByClassName('changed');
    if (changed.length == 0) {
        button.onclick = () => {};
        button.disabled = true;
    } else {
        button.onclick = () => {
            // Disable input.
            setSave(false);
            setAllInputs(false);
            // Update.
            apiSave();
        };
        button.disabled = false;
    }
}

/**
 * Sets all input as enabled or disabled.
 * @param {boolean} enabled If they should be enabled.
 */
function setAllInputs(enabled) {
    let items = document.querySelectorAll(ALL_INPUT_TYPES);
    for (let item of items) {
        item.disabled = !enabled;
    }
}

/**
 * Sets the save button as enabled or disabled.
 * @param {boolean} enabled If it should be enabled.
 */
function setSave(enabled) {
    let button = document.getElementById('save');
    button.disabled = !enabled;
}

/**
 * Sets the sync button as enabled or disabled.
 * @param {boolean} enabled If it should be enabled.
 */
 function setSync(enabled) {
    let button = document.getElementById('sync');
    button.disabled = !enabled;
}

/**
 * Sends a success toast.
 * @param {string} message The message.
 */
function toastSuccess(message) {
    bulmaToast.toast({
        message: message,
        type: 'is-success',
        duration: 2500,
        position: 'top-center'
    });
}

/**
 * Sends an error toast.
 * @param {string} message The message.
 */
function toastError(message) {
    bulmaToast.toast({
        message: message,
        type: 'is-danger',
        duration: 2500,
        position: 'top-center'
    });
}