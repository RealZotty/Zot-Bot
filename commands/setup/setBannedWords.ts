const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { database } = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setbannedwords')
        .setDescription("Set what words/links you don't want being used on your server.")
        .addStringOption((option: any) => 
            option.setName('message').setDescription('What words/links should not be used?').setRequired(true))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    async execute (interaction: any) {
        const { guild, id } = interaction;
        let message = interaction.options.getString('message');
        let data = {
            Action: 'setBannedWords',
            data: {
                bannedWords: message,
                guildId: guild.id,
            }
        }
        const res = await database(data);
        if(res === 200) {
            await interaction.reply({content: `Banned words successfully set.`, ephemeral: true})
        } else {
            await interaction.reply({content: `[ERROR] Command Failed.`, ephemeral: true})
        }
    }
}

export{}