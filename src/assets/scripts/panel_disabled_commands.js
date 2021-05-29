function endpoint() {
    return '/ep/disabledcommands/';
}

function listConstructor(index) {
    switch (index) {
        case 0:
            return listConstructSelect(`list-${index}-value`, 'command');
    }
}