const dashes = [
    {
        name: '',
        template: 'panel_guild',
        portionLink: '/',
        portionName: 'Settings'
    },
    {
        name: 'announcements',
        template: 'panel_announcements',
        portionLink: 'announcements/',
        portionName: 'Announcements'
    },
    {
        name: 'customcommands',
        template: 'panel_customcommands',
        portionLink: 'customcommands/',
        portionName: 'Custom Commands'
    },
    {
        name: 'disabledcommands',
        template: 'panel_disabledcommands',
        portionLink: 'disabledcommands/',
        portionName: 'Disabled Commands'
    },
    {
        name: 'filter',
        template: 'panel_filter',
        portionLink: 'filter/',
        portionName: 'Filter'
    },
    {
        name: 'filterbypasses',
        template: 'panel_filterbypasses',
        portionLink: 'filterbypasses/',
        portionName: 'Filter Bypasses'
    }
];

module.exports = (req, res) => {
    let guild = req.session.guilds.find(it => it.id === req.session.current);
    if (guild == null) {
        console.warn('Found expired guild.');
        res.redirect('/select/');
        return;
    }
    let dash = req.params.dash;
    let panelObject = dash == null ? dashes[0] : dashes.find(it => it.name === dash);
    if (panelObject == null) {
        res.redirect('/panel/');
        return;
    }
    res.render(panelObject.template, {
        login: req.session.authorized,
        title: 'Arraybot Web Panel...',
        subtitle: 'You are modifying ' + guild.name + '.',
        name: guild.name,
        portion_link: panelObject.portionLink,
        portion_name: panelObject.portionName
    });
}