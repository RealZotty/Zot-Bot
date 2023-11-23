const { database } = require('../db');
const { Events }= require('discord.js');

module.exports ={
    name: Events.GuildCreate,
    async execute (guild: any) {
        let Channels: Object[] = [];
        let Roles: Object[] = []
         await guild.channels.fetch().then((x: []) => x.map((c: {type: number, id: string, name: string}) => {
            if(c.type === 0) {
                Channels.push({id: c.id, name: c.name})
            }
        }))
        const roles = await guild.roles.fetch();
       roles.map((a: {id: string, name: string}) => 
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
        }).catch((err: any) => {
            return console.log(err)
        })
    }
};
export{}