module.exports = (view, options) => {
    return (req, res) => {
        let values = {
            login: req.session.authorized
        };
        Object.assign(values, options);
        res.render(view, values);
    };
}