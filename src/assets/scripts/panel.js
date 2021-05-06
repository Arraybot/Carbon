(function() {
    window.onload = () => {
        console.log('penis');
        toastError();
    }
})();

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