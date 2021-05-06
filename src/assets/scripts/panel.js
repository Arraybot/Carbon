(function() {
    window.onload = () => {
        let items = document.querySelectorAll('input,textarea,select');
        for (let item of items) {
            let fun = () => {
                item.classList.add('changed');
                saveButton();
            }
            item.onchange = fun;
            item.onkeypress = fun;
            item.onpaste = fun;
        }
    }
})();

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

function submit() {
    console.log('Submitting');
}

function toastSuccess() {
    bulmaToast.toast({
        message: 'Settings successfully saved and applied!',
        type: 'is-success',
        duration: 2500,
        position: 'top-center'
    });
}

function toastError() {
    bulmaToast.toast({
        message: 'There was an error saving your settings.',
        type: 'is-danger',
        duration: 2500,
        position: 'top-center'
    });
}