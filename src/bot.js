const eris = require('eris');
const TOKEN = process.env.TOKEN || 'sellotape';

const client = new eris('Bot ' + TOKEN, {
    restMode: true
});

exports.guild = (guildId) => {
    let promise1 = client.getRESTGuild(guildId);
    let promise2 = client.getRESTGuildChannels(guildId);
    return Promise.all([promise1, promise2]).then(result => {
        let guild = result[0];
        let channels = result[1];
        return {
            roles: guild.roles.filter(role => role.position !== 0).map(mapper),
            channels: channels.filter(channel => channel.type === 0).map(mapper)
        };
    });
};

function mapper(input) {
    return { id: input.id, name: input.name };
}