const { Events } = require('discord.js');
const { database } = require('../db');

module.exports = {
    name: Events.GuildRoleCreate,
    async execute (role) {
       const roles = await role.guild.roles.fetch();
       let Roles = [];
       roles.map(a => 
        Roles.push({
            id: a.id,
            name: a.name
        }))
    
        await database({Action: 'roleCreate', Roles})
    }
}