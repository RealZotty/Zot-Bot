const { Events } = require('discord.js');
const { database } = require('../db');

module.exports = {
    name: Events.GuildRoleDelete,
    async execute (role: any) {
       const roles = await role.guild.roles.fetch();
       let Roles: Object[] = [];
       roles.map((a: {id: string, name: string}) => 
        Roles.push({
            id: a.id,
            name: a.name
        }))
    
        await database({Action: 'roleDelete', Roles}).catch((err: any) => console.log(err));;
    }
}

export{}