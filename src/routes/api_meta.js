const bot = require('../bot');
const nodeCache = require('node-cache');
const permissions = require('../permissions');

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
        cache.set(cacheId, wrapper);
        res.json(wrapper);
    };
};

// /**
//  * Gets all the per-server metadata.
//  * This entails channels, roles and permissions available.
//  * These are up to date and retrieved from Discord in real time.
//  * @param {Request} req The request.
//  * @param {Response} res The response.
//  */
// exports.get = async (req, res) => {
//     let cacheId = req.session.id;
//     let useCache = req.query.cache;
//     if (cache.has(cacheId) && useCache != false) {
//         console.log('using cache');
//         res.json(cache.get(cacheId));
//         return;
//     }
//     let guildId = req.session.current;
//     let wrapper = await bot.guild(guildId);
//     // Create an array of permissions from existing roles.
//     let perms = wrapper.roles.map(role => {
//         return {
//             id: role.id,
//             name: 'Role: ' + role.name
//         };
//     });
//     // Add each permission to the permission array.
//     permissions.map(permissionWrapper => {
//         return {
//             id: permissionWrapper.id,
//             name: 'Permission: ' + permissionWrapper.name
//         };
//     }).forEach(permissionWrapper => {
//         perms.push(permissionWrapper);
//     });
//     wrapper.permissions = perms;
//     cache.set(cacheId, wrapper);
//     res.json(wrapper);
// };