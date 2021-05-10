const bot = require('../bot');
const redirect = require('../redirecter');

/**
 * Marks which guild is currently being edited by the user.
 * @param {Request} req The request
 * @param {Response} res The response.
 */
module.exports = async (req, res) => {
    let guild = req.params.server;
    // If the user has permission to edit that guild.
    if (req.session.authorized != null && req.session.authorized.includes(guild)) {
        // Update the guild.
        req.session.current = guild;
        // Fetch up-to-date guild metadata.
        let result = await bot.guild(guild);
        req.session.roles = result.roles;
        req.session.channels = result.channels;
    }
    redirect(req, res, '/panel/');
}