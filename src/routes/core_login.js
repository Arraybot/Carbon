const crypto = require('crypto');
const oauth = require('../oauth');
const redirect = require('../redirecter');

/**
 * Redirects to the Discord OAuth2 URL with CSRF security.
 * @param {Request} req The request.
 * @param {Response} res The response.
 */
module.exports = (req, res) => {
    // If they're already logged in, ignore.
    if (req.session.user) {
        redirect(req, res, '/');
        return;
    }
    // Generate CSRF state and save in session.
    let state = crypto.randomBytes(32).toString('hex');
    req.session.state = state;
    redirect(req, res, oauth.generateAuthUrl({ scope: ['identify', 'guilds'], state: state }));
};