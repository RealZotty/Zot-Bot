const { Events } = require('discord.js');
const { database } = require('../db');

module.exports = {
    name: Events.ChannelDelete,
    async execute (channel) {
       let Channels = [];
        channel.guild.channels.fetch().then(x => x.map(c => {
            if(c.type === 0) {
                Channels.push({id: c.id, name: c.name})
            }
        }))
        await database({
            Action: 'channelDelete',
            _id: channel.guild.id,
            channels: Channels,
        })
    }
}