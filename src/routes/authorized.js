const client = require('../oauth');
// Administrator or can manage guild.
const permissions = 0x00000020;

module.exports = (req, res) => {
    let code = req.query.code;
    client
    .tokenRequest({
        scope: ['identify', 'guilds'],
        grantType: 'authorization_code',
        code: code
    })
    .then(auth => {
        let tokenValue = auth.access_token;
        req.session.token = tokenValue;
        Promise
        .all([client.getUser(tokenValue), client.getUserGuilds(tokenValue)])
        .then(data => {
            let user = data[0];
            let guilds = data[1];
            req.session.user = user;
            req.session.guilds = guilds.filter(guild => {
                if (guild.owner) {
                    return true;
                }
                let numberPerms = parseInt(guild.permissions);
                if ((numberPerms & permissions) == permissions) {
                    return true;
                }
                return false;
            });
            req.session.authorized = req.session.guilds.map(guild => guild.id);
            res.redirect('/');
        })
        .catch(err => {
            console.log(err.stack);
            res.render('error', {
                title: 'Discord Error',
                subtitle: 'Could not retrieve data.'
            });
        });
    })
    .catch(err => {
        console.log(err.stack);
        res.render('error', {
            title: 'Discord Error',
            subtitle: 'Could not retrieve token.'
        });
    });
};