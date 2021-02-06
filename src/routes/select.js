const { compile } = require("pug");

module.exports = (req, res) => {
    res.render('select', {
        login: req.session.authorized,
        guilds: req.session.guilds
    });
}