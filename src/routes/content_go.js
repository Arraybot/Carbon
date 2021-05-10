const redirect = require('../redirecter');

/**
 * Creates an express handler that will redirect to the target.
 * @param {string} target The target.
 * @returns A handler that redirects to the target.
 */
module.exports = (target) => {
    return (req, res) => {
        redirect(req, res, target);
    };
}