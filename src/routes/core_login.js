const oauth = require('../oauth');
const redirect = require('../redirecter');

module.exports = (req, res) => {
    if (req.session.authorized) {
        redirect(req, res, '/');
        return;
    }
    redirect(req, res, oauth.generateAuthUrl({ scope: ['identify', 'guilds'] }));
};