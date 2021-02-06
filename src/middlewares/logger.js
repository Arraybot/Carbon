/**
 * Middleware component that does some basic logging.
 * @param {Request} req The request.
 * @param {Response} _ The response.
 * @param {Function} next Callback to call the next middleware component.
 */
module.exports = (req, _, next) => {
    if (!req.url.startsWith('/assets/')) {
        console.log('%s %s %s %s %s', new Date(), req.method, req.url, req.session.current, JSON.stringify(req.session.authorized));
        if (Object.keys(req.body).length !== 0) {
            console.log('\t%s', JSON.stringify(req.body));
        }   
    }
    next();
};