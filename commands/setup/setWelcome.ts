const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { database } = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setwelcome')
        .setDescription('Add a custom greeting when members join your server.')
        .addChannelOption((option: any) => 
            option.setName('channel').setDescription('What channel should the greeting be sent in?').setRequired(true))
        .addStringOption((option: any) => 
            option.setName('message').setDescription('What message should be sent when a user joins the server?').setRequired(true))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    async execute (interaction: any) {
        const { guild, id } = interaction;
        let channelData = interaction.options.getChannel('channel');
        let message = interaction.options.getString('message');
        let channel = {
            id: channelData.id,
            name: channelData.name
        }
        let data = {
            Action: 'setWelcome',
            data: {
                channel,
                message,
                guildId: guild.id
            }
        }
        const res = await database(data);
        if(res === 200) {
            await interaction.reply({content: `Welcome message successfully set.`, ephemeral: true})
        } else {
            await interaction.reply({content: `[ERROR] Command Failed.`, ephemeral: true})
        }
    }
}

export{}