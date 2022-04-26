// The following functions need to be implemented by each panel separately:
// init(void) -> Actions that need to be taken during startup.
// apiLoad(void) -> loads the data and populates the fields, respectively.
// apiSave(void) -> Triggered when the save button is called, and saves the changed values.

var ALL_INPUT_TYPES = 'input,textarea,select';
var META;
var SAFE_QUIT = (event) => {
    event.preventDefault();
    return event.returnValue = 'You have unsaved changes';
}

/**
 * What happens when the window is loaded.
 */
window.onload = () => {
    init();
    let sync = document.getElementById('sync');
    if (sync != null) {
        sync.onclick = () => {
            setSync(false);
            apiMeta(false);
            return false;
        };
    }
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
            // Save in cache,
            META = json;
            let selects = document.getElementsByTagName('select');
            for (let select of selects) {
                genericMetaWrite(json, select);
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
                case 409:
                    toastError(`Could not ${task}, as the name is already in use.`)
                    error();
                    break;
                case 429:
                    toastError(`Could not ${task}, you are sending too many requests.`);
                    error();
                    break;
                case 500:
                    toastError(`Could not ${task}, internal server error.`);
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
 * Writes a value to a static input.
 * @param {object} data The data for all inputs.
 * @param {input} input The respective static input.
 */
function genericStaticWrite(data, input) {
    let value = data[input.name];
    if (value == null) {
        return;
    }
    // Populates the input with the correct value.
    if (input.tagName !== 'SELECT') {
        // If it's not a select, we can set the value directly.
        input.value = value;
    } else {
        // Caveat: dropdowns/selects.
        // Kepp track of the correct index.
        let index = -1;
        for (let i = 0; i < input.length; i++) {
            let convertedValue = `${value}`; // JS quirk...
            if (input.options[i].value == convertedValue) { // Use casting for compatibility with integers and booleans.
                index = i;
                break;
            }
        }
        // Write the index.
        if (index != -1) {
            input.selectedIndex = index.toString();
        }
    }
}

/**
 * Writes all possible meta options to a specific select dropdown.
 * @param {object} data The data.
 * @param {select} select The select.
 * @param {boolean} hasDisabled True: the select has a disabled option as part of the dropdown.
 */
function genericMetaWrite(data, select, hasDisabled) {
    // For every dropdown, populate it with the correct data.
    let type = select.dataset.type;
    let toAdd = [];
    // Give it the correct data to add.
    switch (type) {
        case 'channel':
            toAdd = data.channels;
            break;
        case 'role':
            toAdd = data.roles;
            break;
        case 'permission':
            toAdd = data.permissions;
            break;
        case 'command':
            toAdd = data.commands;
            break;
        default:
            // We clearly should not be modifying this.
            return;
    }
    // Clear existing options
    for (let i = select.options.length - 1; i >= (hasDisabled ? 1 : 0); i--) {
        select.remove(i);
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
    if (button != null) {
        button.disabled = !enabled;
    }
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
        duration: 3000,
        position: 'top-center'
    });
}