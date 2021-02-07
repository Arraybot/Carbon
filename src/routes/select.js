const { compile } = require("pug");

module.exports = (req, res) => {
    res.render('select', {
        login: req.session.authorized,
        guilds: req.session.guilds,
        title: 'Select a server to manage Arraybot in...',
        subtitle: 'You can always change servers later.'
    });
}