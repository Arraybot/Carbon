var LIST_SIZE;
var SNAPSHOTS;

// The following functions need to be implemented by each panel separately:
// apiLoad(void) -> Loads the data and calls respective functions.
// listConstruct(index) -> Constructs an input from the given list index.

function init() {
    LIST_SIZE = document.getElementById('form').dataset.listsize;
    SNAPSHOTS = new Array(LIST_SIZE);
}

function listPopulate(index, values) {
    SNAPSHOTS[index] = values;
    values.forEach(value => {
        listAdd(index, value)
    });
}

function listAdd(index, value) {
    let list = document.getElementById(`list-${index}`);
    let field = document.createElement('div');
    field.classList.add('field', 'has-addons');
    let control1 = document.createElement('div');
    control1.classList.add('control');
    let control2 = control1.cloneNode(true);
    let input = listConstructor(index);
    control1.appendChild(input);
    field.appendChild(control1);
    let button = document.createElement('button');
    button.classList.add('button', 'is-warning');
    button.onclick = (ev) => {
        listDelete(index, ev.currentTarget);
    };
    let span = document.createElement('span');
    span.classList.add('icon');
    let icon = document.createElement('i');
    icon.classList.add('fas', 'fa-trash');
    span.appendChild(icon);
    button.appendChild(span);
    control2.appendChild(button);
    field.appendChild(control2);
    list.appendChild(field);
    if (value != null) {
        // TODO: set default value.
    }
}

function listDelete(index, button) {
    let list = document.getElementById(`list-${index}`);
    let field = button.parentElement.parentElement;
    list.removeChild(field);
}

function apiSave() {

}