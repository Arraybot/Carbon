const redirect = require('../redirecter');
const permissions = require('../permissions');
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
        redirect(req, res, '/select/');
        return;
    }
    let dash = req.params.dash;
    let panelObject = dash == null ? dashes[0] : dashes.find(it => it.name === dash);
    if (panelObject == null) {
        redirect(req, res, '/panel/');
        return;
    }
    let perms = req.session.roles.slice(0).map(role => {
        let name = role.name;
        role.name = 'Role: ' + name;
        return role;
    });
    permissions.forEach(permissionWrapper => {
        let name = permissionWrapper.name;
        permissionWrapper.name = 'Permission: ' + name;
        perms.push(permissionWrapper);
    });
    console.log(perms);
    res.render(panelObject.template, {
        login: req.session.authorized,
        title: 'Arraybot Web Panel...',
        subtitle: 'You are modifying ' + guild.name + '.',
        name: guild.name,
        portion_link: panelObject.portionLink,
        portion_name: panelObject.portionName,
        channels: req.session.channels,
        roles: req.session.roles,
        permissions: perms
    });
}