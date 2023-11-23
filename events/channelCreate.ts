const { Events } = require('discord.js');
const { database } = require('../db');

module.exports = {
    name: Events.ChannelCreate,
    async execute (channel: any) {
       let Channels: Object[] = [];
        await channel.guild.channels.fetch().then((x: []) => x.map((c: {type: number, id: string, name: string}) => {
            if(c.type === 0) {
                Channels.push({id: c.id, name: c.name})
                console.log(c)
            }
        }))
        await database({
            Action: 'channelCreate',
            _id: channel.guild.id,
            channels: Channels,
        })
    }
};

export{}