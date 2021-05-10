/**
 * Renders a view with the specified options.
 * @param {string} view The view to render.
 * @param {object} options The different types of objects.
 */
module.exports = (view, options) => {
    return (req, res) => {
        // Basic properties.
        let values = {
            login: req.session.authorized
        };
        // Add the additional objects.
        Object.assign(values, options);
        res.render(view, values);
    };
}