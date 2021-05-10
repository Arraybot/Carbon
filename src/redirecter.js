// Manually save session 
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