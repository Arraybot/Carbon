const { compile } = require("pug");

module.exports = (req, res) => {
    res.render('select', {
        guilds: req.session.guilds
    });
}