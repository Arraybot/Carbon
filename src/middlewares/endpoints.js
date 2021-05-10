const redirect = require('../redirecter');
const watchdog = require('../watchdog');

/**
 * Middleware component to ensure that a specific API action can only be done by authorized users.
 * @param {Request} req The request.
 * @param {Response} res The response.
 * @param {Function} next Callback to call the next middleware component. 
 */
module.exports = (req, res, next) => {
    // If they are not authorized to perform modifications.
    if (!req.session.user) {
        redirect(req, res, '/login/');
        return;
    }
    // Check if the target exists and that they have permission.
    if (!req.session.current || !watchdog.isAuthorized(req, req.session.current)) {
        redirect(req, res, '/select/');
        return;
    }
    next();
};