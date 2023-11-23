const { database } = require('../db');
const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildDelete,
    async execute(guild: any) {
        database({Action: 'guildDelete', _id: guild.id}).catch((err: any) => {
            console.log(err)
        })
    }
};

export{}