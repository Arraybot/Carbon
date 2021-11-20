const eris = require('eris');
const BOT_TOKEN = process.env.BOT_TOKEN || 'sellotape';

const client = new eris('Bot ' + BOT_TOKEN, {
    restMode: true
});

exports.guild = fetcher;

/**
 * Gets the guild channels and roles.
 * @param {number} guildId The ID of the guild.
 * @returns A promise of all the guild's channels and roles.
 */
async function fetcher(guildId) {
    // Execute REST requests to Discord.
    let guild = await client.getRESTGuild(guildId);
    let channels = await client.getRESTGuildChannels(guildId);
    // Wrap results.
    return {
        // Ignore the @everyone role.
        roles: guild.roles.filter(role => role.position !== 0).map(mapper),
        // Ignore non-text channels.
        channels: channels.filter(channel => channel.type === 0).map(mapper)
    };
}

/**
 * Maps any object to an object with just its ID and name.
 * @param {object} input Any input. Must contain properties 'id' and 'name'.
 * @returns An object containing ID and name.
 */
function mapper(input) {
    return { id: input.id, name: input.name };
}