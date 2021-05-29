function endpoint() {
    return '/ep/filter/';
}

function listConstructor(index) {
    let value = `list-${index}-value`;
    switch (index) {
        case 0:
            return listConstructInput(value);
        case 1:
            return listConstructSelect(value, 'permission');
    }
}