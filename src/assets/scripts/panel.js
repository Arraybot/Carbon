var ALL_INPUT_TYPES = 'input,textarea,select';
var META;

window.onload = () => {
    // Detect when the forms are changed.
    let items = document.querySelectorAll(ALL_INPUT_TYPES);
    for (let item of items) {
        let fun = () => {
            item.classList.add('changed');
            saveButton();
        }
        // Register the event listener for different types.
        item.onchange = fun;
        item.onkeypress = fun;
        item.onpaste = fun;
    }
    apiMeta();
};

/**
 * AJAX: Get all the channels, roles and permissions.
 */
function apiMeta() {
    genericAjaxRequest('GET', '/ep/meta/', null, 'load metadata', (request) => {
        let status = request.status;
        if (status == 200) {
            // Load in the available settings.
            let json = JSON.parse(request.responseText);
            META = json;
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
            // Load the data.
            apiLoad(apiLoadCallback);
            setAllInputs(true);
        } else {
            toastError('Error getting channels, roles and permissions: ' + status);
        }
    });
}

function apiLoadCallback(data) {
    let inputs = document.querySelectorAll(ALL_INPUT_TYPES);
    for (input of inputs) {
        let value = data[input.name];
        if (value == null) {
            continue;
        }
        if (input.tagName !== 'SELECT') {
            input.value = value;
        } else {
            let index = -1;
            for (let i = 0; i < input.length; i++) {
                if (input.options[i].value === value) {
                    index = i;
                    break;
                }
            }
            if (index != -1) {
                input.selectedIndex = index.toString();
            }
        }
    }
}

/**
 * Performs an AJAX request.
 * @param {string} method The HTTP method.
 * @param {string} url The URL.
 * @param {object} body The body. Can be null.
 * @param {Function} handle The handle callback for most things.
 * @param {string} task The task to print.
 */
function genericAjaxRequest(method, url, body, task, handle) {
    let request = new XMLHttpRequest();
    request.open(method, url);
    request.onreadystatechange = function() {
        // Wait for the request to complete.
        if (request.readyState == XMLHttpRequest.DONE) {
            switch (request.status) {
                case 400:
                    toastError(`Could not ${task}. Did you provide invalid data?`);
                    setAllInputs(true);
                    setSave(true);
                    break;
                case 401:
                    toastError(`Could not ${task}, you are not logged in. Please refresh the page and log in.`);
                    setAllInputs(true);
                    setSave(true);
                    break;
                case 403:
                    toastError(`Could not ${task}, you cannot perform this action on this server.`);
                    setAllInputs(true);
                    setSave(true);
                    break;
                case 404:
                    toastError(`Could not ${task}, as the resource could not be found.`);
                    setAllInputs(true);
                    setSave(true);
                    break;
                case 429:
                    toastError(`Could not ${task}, you are sending too many requests.`);
                    setAllInputs(true);
                    setSave(true);
                    break;
                default:
                    handle(request);
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
            // Start constructing the data.
            let data = {};
            // Get all input fields.
            let inputs = document.querySelectorAll(ALL_INPUT_TYPES);
            for (input of inputs) {
                // Ignore those unchanged.
                if (!input.classList.contains('changed')) {
                    continue;
                }
                // Append to payload.
                data[input.name] = input.value;
            }
            // Update.
            apiSave(data);
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
 * Sends a success toast.
 */
function toastSuccess() {
    bulmaToast.toast({
        message: 'Settings successfully saved and applied!',
        type: 'is-success',
        duration: 2500,
        position: 'top-center'
    });
}

/**
 * Sends an error toast.
 */
function toastError(message) {
    bulmaToast.toast({
        message: message,
        type: 'is-danger',
        duration: 2500,
        position: 'top-center'
    });
}