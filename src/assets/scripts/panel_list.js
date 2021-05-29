var LIST_SIZE;
var SNAPSHOTS = [];

// The following functions need to be implemented by each panel separately:
// endpoint(void) -> The endpoint URL.
// listConstruct(index) -> Constructs an input from the given list index.
//     Each constructed element must have the change events point to determineSaveButton().

/**
 * Initializes list based variables.
 */
function init() {
    LIST_SIZE = document.getElementById('form').dataset.listsize;
    for (let i = 0; i < LIST_SIZE; i++) {
        SNAPSHOTS.push(new Array());
    }
    let items = document.querySelectorAll('.static');
    for (let item of items) {
        addSaveAndMarkCallback(item);
    }
}

function apiLoad() {
    genericAjaxRequest('GET', endpoint(), null, 'get filter settings', (request) => {
        // Gets all the values.
        let data = JSON.parse(request.responseText);
        let static = data.static;
        let list = data.list;
        // Write the static values.
        let inputs = document.getElementsByClassName('static');
        // Gets all inputs.
        for (input of inputs) {
            genericStaticWrite(static, input);
        }
        for (let i = 0; i < LIST_SIZE; i++) {
            listPopulate(i, list[i]);
        }
    })
}

/**
 * Saves the changes.
 */
function apiSave() {
    // Start constructing the data.
    let data = {};
    // Get all static input fields.
    let inputs = document.getElementsByClassName('static');
    for (input of inputs) {
        // Append to payload.
        data[input.name] = input.value;
    }
    for (let i = 0; i < LIST_SIZE; i++) {
        let before = SNAPSHOTS[i];
        let after = listGet(i);
        data[`add${i}`] = setDifference(after, before);
        data[`delete${i}`] = setDifference(before, after);
    }
    genericAjaxRequest('PUT', endpoint(), data, 'save filter settings', () => {
        // Settings success, they can now change inputs again.
        toastSuccess('Settings successfully saved and applied!');
        // Remove all the change markers.
        let changed = document.querySelectorAll('.static-changed');
        for (element of changed) {
            element.classList.remove('static-changed');
        }
        setAllInputs(true);
        // Update snapshots.
        for (let i = 0; i < LIST_SIZE; i++) {
            SNAPSHOTS[i] = listGet(i);
        }
        determineSaveButton();
    }, () => {
        // Error, they can change inputs again and try to save again.
        setAllInputs(true);
        determineSaveButton();
    });
}

/**
 * Populates the list with all values.
 * @param {number} index The list.
 * @param {array} values An array of string values.
 */
function listPopulate(index, values) {
    SNAPSHOTS[index] = values;
    values.forEach(value => {
        listAdd(index, value);
    });
}

/**
 * Adds an option to the list.
 * @param {number} index The list.
 * @param {string} value The value.
 */
function listAdd(index, value) {
    // Get the list - this is where all items will be listed beneath.
    let list = document.getElementById(`list-${index}`);
    // Create the field, this is where the input is wrapped.
    let field = document.createElement('div');
    field.classList.add('field', 'has-addons');
    // Control 1 is where the main input is found.
    let control1 = document.createElement('div');
    control1.classList.add('control');
    // Control 2 is where the delete button is found.
    let control2 = control1.cloneNode(true);
    // Create the actual input and give it all the information.
    let input = listConstructor(index);
    let inputIdentifier = `list-${index}-value`;
    // Save input identifier for later.
    input.name = inputIdentifier;
    // Finalize the first control.
    control1.appendChild(input);
    field.appendChild(control1);
    // Create the delete button with functionality.
    let button = document.createElement('button');
    button.classList.add('button', 'is-dark');
    button.onclick = (ev) => {
        listDelete(index, ev.currentTarget);
    };
    // Add the icon.
    let span = document.createElement('span');
    span.classList.add('icon');
    let icon = document.createElement('i');
    icon.classList.add('fas', 'fa-trash');
    // Link all the elements together.
    span.appendChild(icon);
    button.appendChild(span);   
    control2.appendChild(button);
    field.appendChild(control2);
    list.appendChild(field);
    // If the value has been given, initialize the field with value.
    if (value != null) {
        // Data generally expects an object, so we quickly make one.
        let data = {};
        data[inputIdentifier] = value;
        genericStaticWrite(data, input);
        input.disabled = false;
    }
    determineSaveButton();
}

/**
 * Deletes an entry from a list.
 * @param {number} index The list.
 * @param {button} button The delete button.
 */
function listDelete(index, button) {
    let list = document.getElementById(`list-${index}`);
    let field = button.parentElement.parentElement;
    list.removeChild(field);
    determineSaveButton();
}

/**
 * Gets all elements in a list as primitives.
 * @param {number} index The index.
 * @returns A string list of all the values.
 */
function listGet(index) {
    let elements = document.querySelectorAll(ALL_INPUT_TYPES);
    return Array
        .from(elements)
        .filter(element => element.name === `list-${index}-value`)
        .map(element => element.value);
}

/**
 * Creates an input element.
 * @param {string} name The name.
 * @returns An input element.
 */
function listConstructInput(name) {
    let element = document.createElement('input');
    element.classList.add('input');
    element.name = name;
    element.type = 'text';
    element.maxLength = 2000;
    addSaveCallbacks(element);
    return element;
}

/**
 * Creates a select element.
 * @param {string} name The name.
 * @param {string} type The type.
 * @returns A select element.
 */
function listConstructSelect(name, type) {
    let element = document.createElement('div');
    element.classList.add('select');
    let select = document.createElement('select');
    select.name = name;
    // select.classList.add(`list-${index}-value`);
    select.dataset.type = type;
    addSaveCallbacks(select);
    genericMetaWrite(META, select, false);
    element.appendChild(select); 
    return element;
} 

/**
 * Determines if there are any changes.
 * If there are changes, the save button will enable.
 * If there are no changes, the save button will disable.
 */
function determineSaveButton() {
    let classed = document.getElementsByClassName('static-changed');
    // First check if the static values have been changed.
    let changed = classed.length !== 0;
    if (!changed) {
        // Check every single list.
        out:
        for (let i = 0; i < LIST_SIZE; i++) {
            let list1 = SNAPSHOTS[i];
            let list2 = listGet(i);
            if (list1.length != list2.length) {
                changed = true;
                break;
            }
            if (setDifference(list1, list2).length !== 0 || setDifference(list2, list1).length !== 0) {
                changed = true;
                break;
            }
        }
    }
    // Get the button.
    let button = document.getElementById('save');
    // Final check to see if anything changed.
    if (!changed) {
        button.onclick = () => {};
        button.disabled = true;
    } else {
        button.onclick = () => {
            // Disable input until callback.
            setSave(false);
            setAllInputs(false);
            // Update.
            apiSave();
        };
        button.disabled = false;
    }
}

/**
 * Performs a "set" difference on two arrays.
 * @param {array} list1 The first "set".
 * @param {array} list2 The second "set".
 * @returns The elements that are in list 1 that are not in list 2.
 */
function setDifference(list1, list2) {
    return list1.filter(element => !list2.includes(element));
}

/**
 * Adds the save button callback to an element.
 * @param {element} element The element.
 */
function addSaveCallbacks(element) {
    element.onchange = determineSaveButton;
    element.onkeypress = determineSaveButton;
    element.onpaste = determineSaveButton;
}

/**
 * Adds the save button callback and adds the changed class.
 * @param {element} element The element.
 */
function addSaveAndMarkCallback(element) {
    let fun = () => {
        element.classList.add('static-changed');
        determineSaveButton();
    }
    element.onchange = fun;
    element.onkeypress = fun;
    element.onpaste = fun;
}