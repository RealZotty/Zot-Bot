const { SlashCommandBuilder } = require('@discordjs/builders')
const { PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Bulk deletes messages in a channel')
    .addIntegerOption((option: any) => option.setName('number').setDescription('Number of messages you want deleted').setMaxValue(100).setRequired(true))
    .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers),
    async execute(interaction: any) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ADMINISTRATOR)) return interaction.reply({content: `You don't have permission to use this command`, ephemeral: true})
        let number = interaction.options.getInteger('number')
        if (isNaN(number)) return interaction.reply({content: `Numbers only`, ephemeral: true}) 
        if (number > 100) return interaction.reply({content: `Max value 100`, ephemeral: true})        
        interaction.channel.bulkDelete(number, false).then((messages: any) => interaction.reply({content: `Successfully deleted ${messages.size} messages`, ephemeral: true})).catch((error: any) => interaction.reply({ content: `Sorry no messages were deleted due to **${error}**`, ephemeral: true}))
    }
}

export{}