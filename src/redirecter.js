/**
 * Saves the session, then redirects.
 * This is important such that some session data is not lost.
 * @param {Request} req The request.
 * @param {Response} res The response.
 * @param {string} target The target URL.
 * @returns A promise of the redirect process.
 */
module.exports = (req, res, target) => {
    if (req.session == null) {
        return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
        req.session.save(err => {
            if (err == null) {
                res.redirect(target);
                resolve();
            } else {
                console.log(err);
                res.send('Redirect Session Error');
                reject(err);
            }
        });
    });
}