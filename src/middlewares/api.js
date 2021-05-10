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
        res.status(401).send();
        return;
    }
    // Check if the target exists.
    if (!req.session.current) {
        res.status(400).send();
        return;
    }
    // Ensure that they have permission to perform this action.
    if (!watchdog.isAuthorized(req, req.session.current)) {
        res.status(403).send();
        return;
    }
    next();
};