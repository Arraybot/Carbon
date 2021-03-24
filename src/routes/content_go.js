
const redirect = require('../redirecter');

module.exports = (target) => {
    return (req, res) => {
        redirect(req, res, target);
    };
}