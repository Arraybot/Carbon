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
        element = document.createElement('div');
        element.classList.add('select');
        let select = document.createElement('select');
        element.appendChild(select);
        // TODO: do name.
        select.dataset.type = 'permission';
        genericMetaWrite(META, select, false);
    }
    return element;
}