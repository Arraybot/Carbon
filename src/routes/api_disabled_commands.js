const database = require('../database');

exports.get = async (req, res) => {
    try {
        let result = await database.getDisabledCommands(req.session.current);
        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(500).end
    }
};

exports.put = async (req, res) => {
    try {
        await database.setDisabledCommands(req.session.current, req.body);
        res.end();
    } catch (err) {
        console.log(err);
        res.status(500).end
    }
};