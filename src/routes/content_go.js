module.exports = (target) => {
    return (_, res) => {
        res.redirect(target);
    };
}