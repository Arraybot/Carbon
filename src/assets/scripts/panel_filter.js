function apiLoad() {
    
}

function listConstructor(index) {
    let element;
    if (index == 0) {
        element = document.createElement('input');
        element.classList.add('input');
        // TODO: do name.
        element.type = 'text';
        element.maxLength = 2000;
        return element;
    }
    if (index == 1) {
        // TODO: do bypasses.
        // TODO: make sure all meta types are present.
    }
    return element;
}