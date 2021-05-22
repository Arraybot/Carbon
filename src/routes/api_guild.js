const database = require('../database');

exports.get = async (req, res) => {
    res.json(await database.getGuild(req.session.current));
}

exports.put = async (req, res) => {
    await database.setGuild(req.session.current, req.body);
    res.end();
};