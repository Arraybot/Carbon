const bot = require('../bot');
const permissions = require('../permissions');

/**
 * Gets all the per-server metadata.
 * This entails channels, roles and permissions available.
 * These are up to date and retrieved from Discord in real time.
 * @param {Request} req The request.
 * @param {Response} res The response.
 */
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
    wrapper.permissions = perms;
    res.json(wrapper);
};