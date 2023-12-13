const { Events } = require('discord.js');
const { database } = require('../db');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member: any) {
        const { guild } = member;
        const res = await database({Action: 'fetchWelcome', guildId: member.guild.id});
        const { id, welcomeMessage } = await res;
        const welcomeChannel = await JSON.parse(res.welcomeChannel);
        let channel = await guild.channels.fetch(welcomeChannel.id);
        let message = welcomeMessage;
        channel.send(`${message.replace('@', `${member}`)}`)
    }
}

export{}