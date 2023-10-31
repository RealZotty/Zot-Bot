const { database } = require('../db');
const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildDelete,
    async execute(guild) {
        database({Action: 'guildDelete', _id: guild.id}).catch(err => {
            return
        })
    }
}