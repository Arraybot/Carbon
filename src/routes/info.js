const allowed = [];

module.exports = (req, res) => {
    let page = req.params.target;
    if (!page || !allowed.includes(page)) {
        res.redirect(404, '/');
        return;
    }
    res.render(page);
}