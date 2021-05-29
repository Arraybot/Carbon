exports.get = (req, res) => {
    res.json({
        static: [],
        list: [
            ["help"]
        ]
    });
};

exports.put = (req, res) => {
    res.end();
};