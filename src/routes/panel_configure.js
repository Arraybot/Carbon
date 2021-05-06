const bot = require('../bot');
const redirect = require('../redirecter');

module.exports = (req, res) => {
    console.log('Update header');
    let guild = req.params.server;
    if (req.session.authorized != null && req.session.authorized.includes(guild)) {
        req.session.current = guild;
        bot.guild(guild).then(result => {
            req.session.roles = result.roles;
            req.session.channels = result.channels;
            redirect(req, res, '/panel/');
        })
    } else {
        redirect(req, res, '/panel/');
    }
}