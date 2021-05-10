window.onload = () => {
    // Detect when the forms are changed.
    let items = document.querySelectorAll('input,textarea,select');
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
};

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
        button.onclick = submit;
        button.disabled = false;
    }
}

/**
 * Handles what happens when the changes are submitted.
 */
function submit() {
    console.log('Submitting');
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
function toastError() {
    bulmaToast.toast({
        message: 'There was an error saving your settings.',
        type: 'is-danger',
        duration: 2500,
        position: 'top-center'
    });
}