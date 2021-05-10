const bot = require('../bot');
const redirect = require('../redirecter');

module.exports = async (req, res) => {
    let guild = req.params.server;
    if (req.session.authorized != null && req.session.authorized.includes(guild)) {
        req.session.current = guild;
        let result = await bot.guild(guild);
        req.session.roles = result.roles;
        req.session.channels = result.channels;
        redirect(req, res, '/panel/');
    } else {
        redirect(req, res, '/panel/');
    }
}