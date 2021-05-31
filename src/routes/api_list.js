const database = require('../database');

exports.get = function(getter) {
    return async (req, res) => {
        try {
            let result = await getter(req.session.current);
            res.json(result);
        } catch (err) {
            console.log(err);
            res.status(500).end
        }
    };
};

exports.put = function (setter) {
    return async (req, res) => {
        try {
            await setter(req.session.current, req.body);
            res.end();
        } catch (err) {
            console.log(err);
            res.status(500).end
        }
    };
};