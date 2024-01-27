const { Events } = require('discord.js');
const { database } = require('../db');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.MessageUpdate,
    async execute(interaction: any) {
        let author = await interaction.author;
        let member = await interaction.guild.members.fetch(author.id);
        if(author.bot) return;
        if(member.permissions.has(PermissionsBitField.Flags.MUTE_MEMBERS)) return;
        let message = await interaction.reactions.message.content;
        let bannedList = await database({Action: 'fetchBannedWords', guildId: interaction.guild.id}).catch((err: any) => console.log(err));;
        let bannedWords = bannedList.bannedWords.toLowerCase().split(', ');
        let auditLogs = await database({Action: 'fetchAuditLogs', guildId: interaction.guild.id}).catch((err: any) => console.log(err));;
            let channel: any;
            if(auditLogs.enabled) {
                channel = await interaction.guild.channels.fetch(auditLogs.channel.id);
            }
        function validURL(str: string) {
            var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
              '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
              '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
              '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
              '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
              '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
            return !!pattern.test(str);
        }
        bannedWords.map((x: string) => {
            if(validURL(x) && message.includes(x)) {
                interaction.delete().catch((err: any) => console.log(err));
                const deleteEmbedBuilder = new EmbedBuilder()
                        .setColor('Red')
                        .setTitle('Advertisement Detected')
                        .addFields({
                            name:'User', value:`${interaction.author.username}`
                        }, {
                            name:`User's ID`, value:`${interaction.author.id}`
                        }, {
                            name:'Advertisment', value:`${x}`
                        })
                        .setTimestamp()
                    channel.send({embeds: [deleteEmbedBuilder]})
                return interaction.channel.send(`${interaction.member} We don't use those links here.`).then((msg: any) => {
                    return setTimeout(() => msg.delete().catch((err: any) => console.log(err)), 10000)
                })
            } else if(message.includes(x)) {
                interaction.delete().catch((err: any) => console.log(err));
                const deleteEmbedBuilder = new EmbedBuilder()
                        .setColor('Red')
                        .setTitle('Banned Word Detected')
                        .addFields({
                            name:'User' , value:`${interaction.author.username}`
                        }, {
                            name:`User's ID` , value:`${interaction.author.id}`
                        }, {
                            name:'Banned Word' , value:`${x}`
                        })
                        .setTimestamp()
                        channel.send({embeds: [deleteEmbedBuilder]})
                return interaction.channel.send(`${interaction.member} We don't use that word here.`).then((msg: any) => {
                    return setTimeout(() => msg.delete().catch((err: any) => console.log(err)), 10000)
                })
            }
        });
        

    }
}

export{}