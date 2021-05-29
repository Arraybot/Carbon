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
            ["388004558909210624"]
        ]
    });
};

exports.put = (req, res) => {
    res.end();
};