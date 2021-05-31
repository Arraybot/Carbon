const { Pool } = require('pg');
const pool = new Pool();
const validator = require('validator');

module.exports = {
    start: async () => {
        const client = await pool.connect();
        client.release();
    },
    getKnownGuilds: getKnownGuilds,
    getGuild: getGuild,
    setGuild: setGuild,
    getFilter: getFilter,
    setFilter: setFilter
};

pool.on('error', (err, _) => {
    console.error('Error during idle client, aborting', err)
    process.exit(-1)
});

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
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT id FROM guilds;');
        return ids.filter(id => result.rows.some(row => row.id == id));
    } finally {
        client.release();
    }
}

/**
 * Gets the information associated with a guild.
 * @param {number} id The ID.
 * @returns An object containing all the guild information.
 */
async function getGuild(id) {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM guilds WHERE id = $1;', [id]);
        if (result.rowCount == 0) {
            return {};
        }
        return result.rows[0];
    } finally {
        client.release();
    }
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
    const client = await pool.connect();
    try {
        await client.query(query, values);
    } catch(error) {
        throw error;
    } finally {
        client.release();
    }
}

/**
 * Gets all the filter settings in guild.
 * @param {*} id The ID.
 */
async function getFilter(id) {
    let response = {
        static: {},
        list: []
    };
    const client = await pool.connect();
    try {
        await client.query('BEGIN;');
        let settings = await client.query('SELECT * FROM filter_settings WHERE id = $1;', [id]);
        let settingsRow = settings.rows[0];
        response.static.enabled = settingsRow.enabled;
        response.static.regex = settingsRow.regex;
        response.static.silent = settingsRow.silent;
        response.static.private = settingsRow.private;
        response.static.message = settingsRow.message;
        let rules = await client.query('SELECT * FROM filter_rules WHERE id = $1;', [id]);
        let rulesArray = [];
        rules.rows.forEach(row => rulesArray.push(row.rule));
        response.list.push(rulesArray);
        let bypasses = await client.query('SELECT * FROM filter_bypasses WHERE id = $1;', [id]);
        let bypassesArray = [];
        bypasses.rows.forEach(row => bypassesArray.push(row.bypass));
        response.list.push(bypassesArray);
        await client.query('COMMIT;');
    } catch (error) {
        await client.query('ROLLBACK;');
        throw error;
    } finally {
        client.release();
    }
    return response;
}

/**
 * Updates the filter settings in a guild.
 * @param {number} id The ID.
 * @param {object} data A key-value object with all data.
 */
async function setFilter(id, data) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN;');
        await client.query('INSERT INTO filter_settings VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT(id) DO UPDATE SET enabled = $2, regex = $3, silent = $4, private = $5, message = $6;', [
            id,
            validator.toBoolean(data.enabled),
            validator.toBoolean(data.regex),
            validator.toBoolean(data.silent),
            validator.toBoolean(data.private),
            data.message,
        ]);
        let add = async (array, table) => {
            await array.forEach(async toAdd => await client.query(`INSERT INTO ${table} VALUES ($1, $2);`, [id, toAdd]));
        }
        let del = async (array, table, column) => {
            await array.forEach(async toDelete => await client.query(`DELETE FROM ${table} WHERE id = $1 AND ${column} = $2;`, [id, toDelete]));
        }
        if (Array.isArray(data.add0)) {
            await add(data.add0, 'filter_rules');
        }
        if (Array.isArray(data.delete0)) {
            await del(data.delete0, 'filter_rules', 'rule');
        }
        if (Array.isArray(data.add1)) {
            await add(data.add1, 'filter_bypasses');
        }
        if (Array.isArray(data.delete0)) {
            await del(data.delete1, 'filter_bypasses', 'bypass');
        }
        await client.query('COMMIT;');
    } catch (error) {
        await client.query('ROLLBACK;');
        throw error;
    } finally {
        client.release();
    }
}