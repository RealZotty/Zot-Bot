const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { database } = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setauditlogs')
        .setDescription('Enable moderation logs for your server.')
        .addChannelOption((option: any) => 
            option.setName('channel').setDescription('What channel should the logs be sent in?').setRequired(true))
        .addBooleanOption((option: any) => 
            option.setName('boolean').setDescription('Do you want to enable audit logs?').setRequired(true))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    async execute (interaction: any) {
        const { guild, id } = interaction;
        let channelData = interaction.options.getChannel('channel');
        let boolean = interaction.options.getBoolean('boolean');
        let channel = {
            id: channelData.id,
            name: channelData.name
        }
        let data = {
            Action: 'setAuditLogs',
            data: {
                channel,
                boolean,
                guildId: guild.id
            }
        }
        const res = await database(data);
        if(res === 200) {
            await interaction.reply({content: `Audit Logs successfully set.`, ephemeral: true})
        } else {
            await interaction.reply({content: `[ERROR] Command Failed.`, ephemeral: true})
        }
    }
}

export{}