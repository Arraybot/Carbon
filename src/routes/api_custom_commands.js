const database = require('../database')

exports.get = async (req, res) => {
    try {
        const name = req.params.name;
        if (name != null) {
            const custom = await database.getCustomCommand(req.session.current, name);
            if (custom != null) {
                res.json(custom);
            } else {
                res.status(404).end();
            }
        } else {
            res.status(400).end();
        }
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
};

exports.post = (req, res) => {

};

exports.put = (req, res) => {

};

exports.delete = (req, res) => {

};