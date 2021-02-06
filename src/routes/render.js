module.exports = (view) => {
    return (req, res) => {
        res.render(view, {
            login: req.session.authorized
        });
    };
}