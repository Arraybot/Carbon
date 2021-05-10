function apiLoad(callback) {
    genericAjaxRequest('GET', '/ep/guild/', null, 'get settings', (request) => {
        callback(JSON.parse(request.responseText));
    });
}

function apiSave(data) {
    genericAjaxRequest('PUT', '/ep/guild/', data, 'save settings', () => {
        toastSuccess('Settings successfully saved and applied!');
        setAllInputs(true);
        setSave(false);
    }, () => {
        setAllInputs(true);
        setSave(true);
    });
}