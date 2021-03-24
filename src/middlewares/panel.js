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
    next();
};