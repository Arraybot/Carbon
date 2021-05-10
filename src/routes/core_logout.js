/**
 * Logs a user out by forcefully destroying the session.s
 * @param {Request} req The request.
 * @param {Response} res The response.
 */
module.exports = (req, res) => {
    // Destroying the session will erase everything associated with it.
    req.session.destroy((err) => {
        if (err != null) {
            console.log(err.stack);
        }
        res.redirect('/');
    });
};