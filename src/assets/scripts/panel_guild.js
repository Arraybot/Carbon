/**
 * Marks all the changed forms with the "changed" class.
 */
function init() {
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
}

function apiLoad() {
    // Sends the request.
    genericAjaxRequest('GET', '/ep/guild/', null, 'get settings', (request) => {
        // Gets all the values.
        let data = JSON.parse(request.responseText);
        let inputs = document.querySelectorAll(ALL_INPUT_TYPES);
        // Gets all inputs.
        for (input of inputs) {
            genericStaticWrite(data, input);
        }
    });
}

/**
 * Gets all changed input types, get the changed ones, and send a request for those.
 */
function apiSave() {
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
    // Send the request.
    genericAjaxRequest('PUT', '/ep/guild/', data, 'save settings', () => {
        // Settings success, they can now change inputs again.
        toastSuccess('Settings successfully saved and applied!');
        // Remove all the change markers.
        let changed = document.querySelectorAll('.changed');
        for (element of changed) {
            element.classList.remove('changed');
        }
        setAllInputs(true);
        saveButton();
    }, () => {
        toastError('Settings not successfully saved! Try again.')
        // Error, they can change inputs again and try to save again.
        setAllInputs(true);
        saveButton();
    });
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
            // Disable input until callback.
            setAllInputs(false);
            // Update.
            apiSave();
        };
        button.disabled = false;
    }
}