/**
 * Middleware component to handle error handling.
 * @param {Error} err The error.
 * @param {Request} _req The request.
 * @param {Response} res The response.
 * @param {Function} _next Callback to call the next middleware component. 
 */
module.exports = (err, _req, res, _next) => {
    console.log(err.stack);
    res.status(500).render('error', {
        title: 'Door Stuck?!',
        subtitle: 'Internal server error. This incident has been logged.'
    });
};