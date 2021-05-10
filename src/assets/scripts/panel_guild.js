function apiLoad(callback) {
    genericAjaxRequest('GET', '/ep/guild/', null, 'get settings', (request) => {
        callback(JSON.parse(request.responseText));
    });
}

function apiSave(data) {
    genericAjaxRequest('PUT', '/ep/guild/', data, 'save settings', () => {
        toastSuccess();
        setAllInputs(true);
        setSave(false);
    });
}