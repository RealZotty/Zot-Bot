const { database } = require('../db');
const { Events }= require('discord.js');

module.exports ={
    name: Events.GuildCreate,
    async execute (guild) {
        let Channels = [];
        let Roles = []
         await guild.channels.fetch().then(x => x.map(c => {
            if(c.type === 0) {
                Channels.push({id: c.id, name: c.name})
            }
        }))
        const roles = await guild.roles.fetch();
       roles.map(a => 
        Roles.push({
            id: a.id,
            name: a.name
        }))
        database({
            Action: 'guildCreate',
            _id: guild.id,
            name: guild.name,
            channels: Channels,
            Roles,
        }).catch(err => {
            return console.log(err)
        })
    }
}