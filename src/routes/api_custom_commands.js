const database = require('../database')

exports.get = async (req, res) => {
    try {
        const name = getName(req);
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

exports.post = async (req, res) => {
    // TODO: Validate with Discord to not go over the limit.
    const regex = /^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/gu;
    try {
        const name = getName(req);
        if (name != null || !regex.test(name)) {
            await database.createCustomCommand(req.session.current, name);
            res.status(204).end();
        } else {
            res.status(400).end();
        }
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
};

exports.put = async (req, res) => {

};

exports.delete = async (req, res) => {
    try {
        const name = getName(req);
        if (name != null) {
            await database.deleteCustomCommand(req.session.current, name);
            res.status(204).end();
        } else {
            res.status(400).end();
        }
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
};

function getName(req) {
    const name = req.params.name;
    if (name == null) {
        return null;
    }
    return decodeURIComponent(name);
}