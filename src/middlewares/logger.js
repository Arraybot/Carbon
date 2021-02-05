/**
 * Middleware component that does some basic logging.
 * @param {Request} req The request.
 * @param {Response} _ The response.
 * @param {Function} next Callback to call the next middleware component.
 */
module.exports = (req, _, next) => {
    console.log('%s %s %s %s', new Date(), req.method, req.url, JSON.stringify(req.session));
    next();
};