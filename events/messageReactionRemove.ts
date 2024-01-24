const { Events } = require('discord.js');
const { database } = require('../db');

module.exports = {
    name: Events.MessageReactionRemove,
    async execute (reaction: any, user: any) {
        let guildId = reaction.message.guildId;
       if(reaction.partial) {
        reaction = await reaction.fetch()
       }
       let guild = await reaction.message.guild.fetch()
       let member = await guild.members.fetch(user.id)
       let rulesEmbed = await database({Action: 'getRulesEmbed', guildId: reaction.message.guildId})
       let msgId = rulesEmbed.id;
       let roleId = rulesEmbed.reactionRole;
       let role = await guild.roles.fetch(roleId)
       if(reaction.message.id === msgId) {
        member.roles.remove(role).catch((err: any) => console.log(err))
       }
    }
};

export{}