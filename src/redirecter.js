// Manually save session 
module.exports = (req, res, target) => {
    if (req.session == null) {
        return;
    }
    req.session.save(err => {
        if (err == null) {
            res.redirect(target);
        } else {
            console.log(err);
            res.send('Redirect Session Error');
        }
    });
}