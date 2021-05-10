/**
 * Renders the guild selection screen.
 * @param {Request} req The request.
 * @param {Response} res The response.
 */
module.exports = (req, res) => {
    res.render('select', {
        login: req.session.user,
        guilds: req.session.guilds,
        title: 'Select a server to manage Arraybot in...',
        subtitle: 'You can always change servers later.'
    });
}