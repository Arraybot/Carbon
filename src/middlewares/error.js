/**
 * Middleware component to handle error handling.
 * @param {Error} err The error.
 * @param {Request} req The request.
 * @param {Response} res The response.
 * @param {Function} _next Callback to call the next middleware component. 
 */
module.exports = (err, req, res, _next) => {
    console.log(err.stack);
    res.status(500).render('error', {
        login: req.session.authorized,
        title: 'Door Stuck?!',
        subtitle: 'Internal server error. This incident has been logged.'
    });
};