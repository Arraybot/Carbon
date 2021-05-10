const bot = require('../bot');
const permissions = require('../permissions');

exports.get = async (req, res) => {
    let guildId = req.session.current;
    let wrapper = await bot.guild(guildId);
    // Create an array of permissions from existing roles.
    let perms = wrapper.roles.map(role => {
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
    wrapper.perms = perms;
    res.json(wrapper);
};