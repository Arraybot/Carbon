const redirect = require('../redirecter');

/**
 * Middleware component to ensure that a specific API action can only be done by authorized users.
 * @param {Request} req The request.
 * @param {Response} res The response.
 * @param {Function} next Callback to call the next middleware component. 
 */
module.exports = (req, res, next) => {
    // If they are not authorized to perform modifications.
    if (!req.session.authorized) {
        redirect(req, res, '/login/');
        return;
    }
    // Check if the target exists.
    if (!req.session.current) {
        console.log('Selection not present');
        redirect(req, res, '/select/');
        return;
    }
    // Ensure that they have permission to perform this action.
    let authorized = req.session.authorized;
    if (!Array.isArray(authorized) || !authorized.includes(req.session.current)) {
        redirect(req, res, '/select/');
        return;
    }
    next();
};