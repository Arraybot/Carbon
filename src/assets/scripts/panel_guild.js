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
        setAllInputs(true);
        setSave(false);
    }, () => {
        // Error, they can change inputs again and try to save again.
        setAllInputs(true);
        setSave(true);
    });
}

function apiLoad() {
    // Sends the request.
    genericAjaxRequest('GET', '/ep/guild/', null, 'get settings', (request) => {
        // Gets all the values.
        let data = JSON.parse(request.responseText);
        let inputs = document.querySelectorAll(ALL_INPUT_TYPES);
        // Gets all inputs.
        for (input of inputs) {
            let value = data[input.name];
            if (value == null) {
                continue;
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
                    if (input.options[i].value === value) {
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
    });
}