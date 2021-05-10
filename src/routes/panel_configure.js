const bot = require('../bot');
const redirect = require('../redirecter');
const watchdog = require('../watchdog');

/**
 * Marks which guild is currently being edited by the user.
 * @param {Request} req The request
 * @param {Response} res The response.
 */
module.exports = async (req, res) => {
    let guild = req.params.server;
    // If the user has permission to edit that guild.
    if (watchdog.isAuthorized(guild)) {
        // Update the guild.
        req.session.current = guild;
    }
    redirect(req, res, '/panel/');
}