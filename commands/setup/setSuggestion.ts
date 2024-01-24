const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { database } = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setsuggestions')
        .setDescription('Configure the suggestions channel.')
        .addChannelOption((option: any) => option.setName('channel').setDescription('What channel should the suggestions be sent to?').setRequired(true))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    async execute(interaction: any) {
        const { guild, id } = interaction;
        const channel = interaction.options.getChannel('channel');
        return await database({Action: 'setSuggestionChannel', guildId: guild.id, data: {
            channel: channel.id,
        }}).catch((err: any) => interaction.reply({content: `An error has occured ${err}`, ephemeral: true})).then((x: any) => {
            if(x) {
                return interaction.reply({content: `Successfully updated.`, ephemeral: true})
            }
        })
    }
}

export{}