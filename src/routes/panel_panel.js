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

/**
 * Renders the pannel.
 * @param {Request} req The request.
 * @param {Response} res The response.
 */
module.exports = (req, res) => {
    // See if the guild has "expired" by now.
    let guild = req.session.guilds.find(it => it.id === req.session.current);
    if (guild == null) {
        console.warn('Found expired guild.');
        redirect(req, res, '/select/');
        return;
    }
    // See what dashboard they are on, and render that.
    let dash = req.params.dash;
    let panelObject = dash == null ? dashes[0] : dashes.find(it => it.name === dash);
    if (panelObject == null) {
        // Unknwon dash, go to main panel page.
        redirect(req, res, '/panel/');
        return;
    }
    // Create an array of permissions from existing roles.
    let perms = req.session.roles.map(role => {
        return {
            id: role.id,
            name: 'Role: ' + role.name
        };
    });
    // Add each permission to the permission array.
    permissions.map(permissionWrapper => {
        return {
            id: permissionWrapper.id,
            name: 'Permission: ' + permissionWrapper.name
        };
    }).forEach(permissionWrapper => {
        perms.push(permissionWrapper);
    });
    // Render the final panel.
    res.render(panelObject.template, {
        login: req.session.authorized,
        title: 'Arraybot Web Panel...',
        subtitle: 'You are modifying ' + guild.name + '.',
        name: guild.name,
        template_id: panelObject.template,
        portion_link: panelObject.portionLink,
        portion_name: panelObject.portionName,
        channels: req.session.channels,
        roles: req.session.roles,
        permissions: perms
    });
}