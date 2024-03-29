const database = require('../database');

exports.get = async (req, res) => {
    try {
        res.json(await database.getGuild(req.session.current));
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
}

exports.put = async (req, res) => {
    try {
        await database.setGuild(req.session.current, req.body);
        res.end()
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
};