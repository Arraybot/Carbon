module.exports = (req, res) => {
    let guild = req.params.server;
    if (req.session.authorized != null && req.session.authorized.includes(guild)) {
        req.session.current = guild;
    }
    res.redirect('/panel/');
}