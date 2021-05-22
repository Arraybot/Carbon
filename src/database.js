const { Client } = require('pg');
const client = new Client();

module.exports = {
    start: async () => {
        await client.connect();
    },
    getKnownGuilds: getKnownGuilds,
    getGuild: getGuild,
    setGuild: setGuild
};

// 
// Guild related queries and information.
//

const guildColumns = [
    'prefix', 
    'join_role', 'join_channel', 'join_message',
    'leave_channel', 'leave_message',
    'mod_log', 'mute_role', 'mute_permission'
];

/**
 * Gets all the known guilds from the database and performs a set union on the IDs in the parameter.
 * This could be done by an IN operator in SQL but that's very tedious with this library.
 * @param {array} ids An array of known IDs.
 * @returns All the IDs in common.
 */
async function getKnownGuilds(ids) {
    const result = await client.query('SELECT id FROM guilds;');
    return ids.filter(id => result.rows.some(row => row.id == id));
}

/**
 * Gets the information associated with a guild.
 * @param {number} id The ID.
 * @returns An object containing all the guild information.
 */
async function getGuild(id) {
    const result = await client.query('SELECT * FROM guilds WHERE id = $1;', [id]);
    if (result.rowCount == 0) {
        return {};
    }
    return result.rows[0];
}

/**
 * Updates the values in a guild.
 * This builds the query dynamically based on the input, and chooses the column names off of a whitelist.
 * It's quite an ugly solution but preferrable to running a lot of update statements.
 * @param {number} id The ID.
 * @param {object} payload A key-value object with all the columns to update.
 */
async function setGuild(id, payload) {
    let values = [];
    let query = 'UPDATE guilds SET '
    let counter = 0;
    guildColumns.forEach(column => {
        let value = payload[column];
        if (value == null) {
            return;
        }
        query += `${column} = $${++counter}, `;
        values.push(value);
    });
    if (query.endsWith(', ')) {
        query = query.substring(0, query.length - 2);
    }
    query += ` WHERE id = $${++counter};`;
    values.push(id);
    await client.query(query, values);
}