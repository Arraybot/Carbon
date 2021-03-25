exports.getKnownGuilds = knownGuilds;

// SELECT id FROM guilds WHERE id IN ?;
function knownGuilds(ids) {
    return new Promise((resolve, _) => {
        resolve(['215520016706174977', '388004256101433345']);
    });
}