const client = require('../oauth');
// Administrator or can manage guild.
const permissions = 0x00000020;

module.exports = (req, res) => {
    let code = req.query.code;
    // Request the OAuth2 token from the code given in the callback.
    client
    .tokenRequest({
        scope: ['identify', 'guilds'],
        grantType: 'authorization_code',
        code: code
    })
    .then(auth => {
        // Obtained the token, need to fetch user information and all guilds.
        let tokenValue = auth.access_token;
        req.session.token = tokenValue;
        // Combine both promises to make handling easier.
        Promise
        .all([client.getUser(tokenValue), client.getUserGuilds(tokenValue)])
        .then(data => {
            let user = data[0];
            let guilds = data[1];
            req.session.user = user;
            // Only allow the guilds in which the user has permissions.
            req.session.guilds = guilds
                // Sort alphabetically first.
                .sort((a, b) => {
                    return a.name.localeCompare(b.name);
                })
                // Filter.
                .filter(guild => {
                    if (guild.owner) {
                        return true;
                    }
                    // Bitwise AND should determine if the permission bit is set.
                    let numberPerms = parseInt(guild.permissions);
                    if ((numberPerms & permissions) == permissions) {
                        return true;
                    }
                    return false;
                });
            // Have an authorized parameter with just the IDs.
            req.session.authorized = req.session.guilds.map(guild => guild.id);
            res.redirect('/panel/');
        })
        .catch(err => {
            console.log(err.stack);
            // We don't need to render the login because the login failed.
            res.render('error', {
                title: 'Discord Error',
                subtitle: 'Could not retrieve data.'
            });
        });
    })
    .catch(err => {
        console.log(err.stack);
        // We don't need to render the login here either.
        res.render('error', {
            title: 'Discord Error',
            subtitle: 'Could not retrieve token.'
        });
    });
};