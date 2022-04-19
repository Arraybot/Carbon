/**
 * The default values for all database entities.
 * These should correspond to the default values set in SQL.
 */

exports.guild = {
    guide: '',
    join_role: -1,
    join_channel: -1,
    join_message: '',
    leave_channel: -1,
    leave_message: '',
    mod_log: -1,
    mute_role: -1,
    mute_permission: ''
};

exports.filter = {
    enabled: false,
    regex: false,
    silent: false,
    private: false,
    message: ''
}

exports.custom_command = {
    input: false,
    type: 'MESSAGE',
    permission: '',
    description: 'No description set...',
    value: 'Update me in the dashboard!'
}