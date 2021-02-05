/**
 * Middleware component to ensure that a specific API action can only be done by authorized users.
 * @param {Request} req The request.
 * @param {Response} res The response.
 * @param {Function} next Callback to call the next middleware component. 
 */
module.exports = (req, res, next) => {
    // If they are not authorized to perform modifications.
    if (!req.session.authorized) {
        res.redirect('/login/');
        return;
    }
    // Check if the target exists.
    if (!req.session.current) {
        res.redirect('/select/');
        return;
    }
    // Ensure that they have permission to perform this action.
    let authorized = req.session.authorized;
    if (!Array.isArray(authorized) || !authorized.includes(req.session.current)) {
        res.redirect('/select/');
        return;
    }
    next();
};