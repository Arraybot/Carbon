const { Pool } = require('pg');
const pool = new Pool();
const validator = require('validator');
const defaults = require('./defaults');

module.exports = {
    start: async () => {
        const client = await pool.connect();
        client.release();
    },
    stop: async () => {
        await pool.end();
    },
    getKnownGuilds: getKnownGuilds,
    getGuild: getGuild,
    setGuild: setGuild,
    getDisabledCommands: getDisabledCommands,
    setDisabledCommands: setDisabledCommands,
    getFilter: getFilter,
    setFilter: setFilter,
    getCustomCommands: getCustomCommands,
    getCustomCommand: getCustomCommand,
    createCustomCommand: createCustomCommand,
    deleteCustomCommand: deleteCustomCommand
};

pool.on('error', (err, _) => {
    console.error('Error during idle client, aborting', err)
    process.exit(-1)
});

// 
// Guild related queries and information.
//

const guildColumns = [
    'join_role', 'join_channel', 'join_message',
    'leave_channel', 'leave_message',
    'mod_log', 'mute_role', 'mute_permission',
    'guide'
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
            return defaults.guild;
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
    let query = 'UPDATE guilds SET ';
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
        static: defaults.filter,
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
        let rules = await client.query('SELECT rule FROM filter_rules WHERE id = $1;', [id]);
        let rulesArray = [];
        rules.rows.forEach(row => rulesArray.push(row.rule));
        response.list.push(rulesArray);
        let bypasses = await client.query('SELECT bypass FROM filter_bypasses WHERE id = $1;', [id]);
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

/**
 * Gets all the disabled commands in guild.
 * @param {*} id The ID.
 */
async function getDisabledCommands(id) {
    let response = {
        static: {},
        list: []
    };
    const client = await pool.connect();
    try {
        await client.query('BEGIN;');
        let disabled = await client.query('SELECT name FROM disabled_commands WHERE id = $1;', [id]);
        let disabledArray = [];
        disabled.rows.forEach(row => disabledArray.push(row.name));
        response.list.push(disabledArray);
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
 * Updates the disabled commands in a guild.
 * @param {number} id The ID.
 * @param {object} data A key-value object with all data.
 */
async function setDisabledCommands(id, data) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN;');
        if (Array.isArray(data.add0)) {
           data.add0.forEach(async toAdd => await client.query('INSERT INTO disabled_commands VALUES ($1, $2);', [id, toAdd]));
        }
        if (Array.isArray(data.delete0)) {
            data.delete0.forEach(async toDelete => await client.query('DELETE FROM disabled_commands WHERE id = $1 AND name = $2;', [id, toDelete]));
        }
        await client.query('COMMIT;');
    } catch (error) {
        await client.query('ROLLBACK;');
        throw error;
    } finally {
        client.release();
    }
}

/**
 * Gets all custom commands for a guild.
 * @param {number} id The ID.
 */
async function getCustomCommands(id) {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT "name", "description" FROM custom_commands WHERE id = $1;', [id]);
        return result.rows;
    } finally {
        client.release();
    }
}

/**
 * Gets a single custom command.
 * @param {number} id The ID.
 * @param {string} name The custom command name.
 * @returns The custom command, or null.
 */
async function getCustomCommand(id, name) {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM custom_commands WHERE id = $1 AND name = $2;', [id, name]);
        return result.length > 0 ? result.rows[0] : null;
    } finally {
        client.release();
    }
}

/**
 * Creates a custom command with default values.
 * Will cause a collision if the name already exists.
 * @param {number} id The ID.
 * @param {string} name The custom command name.
 */
async function createCustomCommand(id, name) {
    const client = await pool.connect();
    try {
        await client.query('INSERT INTO custom_commands (id, name) VALUES ($1, $2);', [id, name]);
    } catch (exception) {
        // Silently let duplicates fail and pretend everything went okay.
        // Let them edit the existing command if they want to.
        if (exception.code !== '23505') {
            console.log(exception);
        }
    } finally {
        client.release();
    }
}

/**
 * Deletes a custom command.
 * Will drop silently if it does not exist.
 * @param {number} id The ID.
 * @param {string} name The custom command name.
 */
async function deleteCustomCommand(id, name) {
    const client = await pool.connect();
    try {
        await client.query('DELETE FROM custom_commands WHERE id = $1 AND name = $2;', [id, name]);
    } finally {
        client.release();
    }
}