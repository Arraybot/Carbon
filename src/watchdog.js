const client = require('./oauth');
const database = require('./database');
const nodeCache = require('node-cache');
// Administrator or can manage guild.
const permissions = 0x00000020;

module.exports = {
    validate: validate,
    isAuthorized: isAuthorized,
    getGuilds: getGuilds
};

// A cache of a 10 minute window.
const cache = new nodeCache({ stdTTL: 300, checkperiod: 600 });

/**
 * Ensure that the cached guild information is correct.
 * This includes re-computing permissions regularly.
 * @param {Request} req The request.
 */
async function validate(req) {
    if (!req.session || !req.session.user) {
        return;
    }
    let cacheId = req.session.id;
    // First check if there is a cache hit.
    if (cache.has(cacheId)) {
        // We do not need to update anything here.
        return;
    }
    let guilds = await client.getUserGuilds(req.session.token);
    // Only allow the guilds in which the user has permissions.
    let permGuilds = guilds
        // Sort alphabetically first.
        .sort((a, b) => {
            return a.name.localeCompare(b.name);
        })
        // Filter.
        .filter(guild => {
            if (guild.owner) {
                return true;
            }
            // Bitwise AND should determine if the permission bit is set.
            let numberPerms = parseInt(guild.permissions);
            if ((numberPerms & permissions) == permissions) {
                return true;
            }
            return false;
        });
    // Get all known guilds.
    let known = await database.getKnownGuilds(permGuilds.map(guild => guild.id));
    // Only include the guilds in the database (have to use this since known does not contain any metadata).
    let final = permGuilds.filter(guild => known.includes(guild.id));
    // Update the cache.
    cache.set(cacheId, true);
    // Set the session variables.
    req.session.guilds = final;
    req.session.authorized = final.map(guild => guild.id);
}

/**
 * Whether or not the requester is authorized to modify the guild.
 * @param {Request} req The request.
 * @param {string} guildId The guild ID.
 * @returns True if they are, false otherwise.
 */
async function isAuthorized(req, guildId) {
    if (req.session == null) {
        return false;
    }
    await validate(req);
    let authorized = req.session.authorized;
    return authorized != null && Array.isArray(authorized) && authorized.includes(guildId);
}

/**
 * Gets all guilds the requester can modify.
 * @param {Request} req The request.
 * @returns An array of guilds.
 */
async function getGuilds(req) {
    if (req.session == null) {
        return false;
    }
    await validate(req);
    let guilds = req.session.guilds;
    return guilds == null ? [] : guilds;
}