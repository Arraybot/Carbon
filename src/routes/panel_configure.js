const redirect = require('../redirecter');

module.exports = (req, res) => {
    console.log('Update header');
    let guild = req.params.server;
    if (req.session.authorized != null && req.session.authorized.includes(guild)) {
        req.session.current = guild;
    }
    redirect(req, res, '/panel/');
}