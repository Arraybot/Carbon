exports.get = (req, res) => {
    res.json({
        static: {
            enabled: true,
            regex: true,
            silent: true,
            private: true,
            message: 'Forbidden phrase'
        },
        list: [
            ["dummy"],
            ["MANAGE_SERVER"]
        ]
    });
};

exports.put = (req, res) => {
    res.end();
};