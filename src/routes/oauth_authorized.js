const client = require('../oauth');
const redirect = require('../redirecter');
const database = require('../database');
// Administrator or can manage guild.
const permissions = 0x00000020;

module.exports = handle;

async function handle(req, res) {
    try {
        let code = req.query.code;
        let auth = await client.tokenRequest({
            scope: ['identify', 'guilds'],
            grantType: 'authorization_code',
            code: code
        });
        // Obtained the token, need to fetch user information and all guilds.
        let tokenValue = auth.access_token;
        req.session.token = tokenValue;
        // Get the user + guilds.
        let user = await client.getUser(tokenValue);
        let guilds = await client.getUserGuilds(tokenValue);
        req.session.user = user;
        // Only allow the guilds in which the user has permissions.
        let permGuilds = guilds
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
        let known = await database.getKnownGuilds(permGuilds.map(guild => guild.id));
        // Only include the guilds in the database.
        req.session.guilds = permGuilds.filter(guild => known.includes(guild.id));
        // Have an authorized parameter with just the IDs.
        req.session.authorized = req.session.guilds.map(guild => guild.id);
        redirect(req, res, '/select/');
    } catch (exception) {
        console.error(exception);
        res.render('error', {
            title: 'Authorization Error',
            subtitle: 'Something went wrong. Please contact an administrator.'
        });
    }
}