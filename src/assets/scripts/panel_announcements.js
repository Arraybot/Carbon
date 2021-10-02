function endpoint() {
    return '/ep/announcements/';
}

function listConstructor(index) {
    switch (index) {
        case 0:
            return listConstructInput(`list-${index}-value`);
    }
}