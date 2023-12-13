const { Events } = require('discord.js');
const { database } = require('../db');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(interaction: any) {
        let author = await interaction.author;
        let member = await interaction.guild.members.fetch(author.id);
        if(author.bot) return;
        //if(member.permissions.has(PermissionsBitField.Flags.MUTE_MEMBERS)) return;
        let message = await interaction.content;
        let bannedList = await database({Action: 'fetchBannedWords', guildId: interaction.guild.id});
        console.log(bannedList)
        function validURL(str: string) {
            var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
              '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
              '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
              '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
              '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
              '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
            return !!pattern.test(str);
        }
    }
}

export{}