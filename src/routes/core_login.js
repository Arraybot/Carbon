const oauth = require('../oauth');

module.exports = (req, res) => {
    if (req.session.authorized) {
        res.redirect('/');
    }
    res.redirect(oauth.generateAuthUrl({ scope: ['identify', 'guilds'] }));
};