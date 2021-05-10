const crypto = require('crypto');
const oauth = require('../oauth');
const redirect = require('../redirecter');

module.exports = (req, res) => {
    if (req.session.authorized) {
        redirect(req, res, '/');
        return;
    }
    let state = crypto.randomBytes(32).toString('hex');
    req.session.state = state;
    redirect(req, res, oauth.generateAuthUrl({ scope: ['identify', 'guilds'], state: state }));
};