module.exports = (req, res) => {
    req.session.destroy((err) => {
        if (err != null) {
            console.log(err.stack);
        }
        res.redirect('/');
    });
};