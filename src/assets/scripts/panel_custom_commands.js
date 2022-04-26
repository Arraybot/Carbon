var pendingDeletion = [];

function init() {
    // Delete button.
    let items = document.getElementsByClassName('delete-button');
    for (let item of items) {
        // Get the hash of the card and the name of the custom command.
        let hash = item.dataset.refers;
        let name = item.dataset.name;
        // Callback when delete button is clicked.
        item.onclick = () => {
            // Remove card, pend deletion, enable save button.
            document.getElementById(`card-` + hash).remove();
            pendingDeletion.push(name);
            setSave(true);
            return false;
        }
    }
    // Create button.
    let create = document.getElementById('new_button');
    let nameInput = document.getElementById('new_name');
    create.onclick = () => {
        let name = nameInput.value;
        if (name != '') {
            newCustomCommand(nameInput.value);
        }
        return false;
    }
    // Save button.
    let save = document.getElementById('save');
    save.onclick = apiSave;
}

function apiLoad() {
    // Does not do anything, custom commands are SSR'd.
}

function apiSave() {
    // Deletes the custom commands pending deletion.
    for (let name of pendingDeletion) {
        genericAjaxRequest('DELETE', '/ep/customcommands/' + encodeURIComponent(name), null, 'delete command ' + name, (_) => {
            toastSuccess('Successfully deleted command ' + name + '.');
            setSave(false);
        }, () => {
            setSave(true);
        });
    }
    setSave(false);
}

function newCustomCommand(name) {
    const regex = /^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/gu;
    if (regex.test(name)) {
        let encoded = encodeURIComponent(name);
        genericAjaxRequest('POST', '/ep/customcommands/' + encoded, null, 'create command ' + name, (_) => {
            toastSuccess('Successfully created custom command, redirecting....');
            setTimeout(() => {
                window.location.replace('/panel/customcommand/?name=' + encoded);
            }, 1500);
        }, () => {});
    } else {
        toastError('That name contains illegal characters!');
    }

}