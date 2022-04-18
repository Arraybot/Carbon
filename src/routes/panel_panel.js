const redirect = require('../redirecter');
const dashes = [
    {
        name: '',
        template: 'panel_guild',
        portionLink: '/',
        portionName: 'Settings',
        renderSync: true
    },
    {
        name: 'customcommands',
        template: 'panel_customcommands',
        portionLink: 'customcommands/',
        portionName: 'Custom Commands',
        renderSync: false
    },
    {
        name: 'disabledcommands',
        template: 'panel_disabledcommands',
        portionLink: 'disabledcommands/',
        portionName: 'Disabled Commands',
        renderSync: false
    },
    {
        name: 'filter',
        template: 'panel_filter',
        portionLink: 'filter/',
        portionName: 'Filter',
        renderSync: true
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
    // Render the final panel.
    res.render(panelObject.template, {
        login: req.session.user,
        title: 'Arraybot Web Panel...',
        subtitle: 'You are modifying ' + guild.name + '.',
        name: guild.name,
        template_id: panelObject.template,
        portion_link: panelObject.portionLink,
        portion_name: panelObject.portionName,
        render_sync: panelObject.renderSync
    });
}