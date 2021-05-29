const bot = require('../bot');
const nodeCache = require('node-cache');
const permissions = require('../constants/permissions');
const commands = require('../constants/commands');

const cache = new nodeCache({ stdTTL: 600, checkperiod: 1200 });

/**
 * Generates a function for the GET method depending on the cache setting.
 * @param {boolean} useCache True if this should use the cache when available.
 * @returns A function that can be used as an Express method handler.
 */
exports.generatorGet = (useCache) => {
    return async (req, res) => {
        let cacheId = req.session.id;
        if (cache.has(cacheId) && useCache != false) {
            res.json(cache.get(cacheId));
            return;
        }
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
        wrapper.commands = commands.map(command => ({
            id: command,
            name: command
        }));
        cache.set(cacheId, wrapper);
        res.json(wrapper);
    };
};