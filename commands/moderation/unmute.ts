const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { database } = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('unmute rule abiding users.')
        .addUserOption((option: any) => 
            option.setName('user').setDescription('Specify the user to be unmuted.').setRequired(true))
        .addStringOption((option: any) => 
            option.setName('reason').setDescription('Why is the user being umuted?').setRequired(true))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers),
    async execute(interaction: any) {
        const { guild, id } = interaction;
        if(interaction.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
            let member = interaction.options.getMember('user');
            let user = interaction.options.getUser('user');
            let reason = interaction.options.getString('reason');
            if(!member) return await interaction.reply({ content: 'That is an invalid user.', ephemeral: true});
            if(!reason) return await interaction.reply({ content: 'Please specify a unmute reason.', ephemeral: true});
            let auditLogs = await database({Action: 'fetchAuditLogs', guildId: guild.id}).catch((err: any) => console.log(err));;
            let channel: any;
            if(auditLogs.enabled) {
                channel = await interaction.guild.channels.fetch(auditLogs.channel.id);
            }
            const unmuteMessage = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('Administrative Action')
                    .setDescription(`${member} has been unmuted`)
                    .setAuthor({ name: 'ZotBot'})
                    .addFields(
                        { name: 'Reason', value: `${reason}`},
                        { name: 'Unmuted By', value: `${interaction.member}`},
                    )
                    .setTimestamp()
            await member.timeout(null, reason).then(async (data: any, err: any) => {
                if(err) return await interaction.reply({ content: `[ERROR] Unmute Failed. ${err}`, ephemeral:  true});
                channel.send({ embeds: [unmuteMessage]});
                interaction.reply({content: `${member} has been unmuted.`, ephemeral: true});
                const dbData = {
                    Action: 'Unmute',
                    User: user.username,
                    Reason: reason,
                    Author: interaction.user.username,
                    timestamp: unmuteMessage.data.timestamp,
                    guildId: guild.id,
                }
                database(dbData)
            });
        } else {
            await interaction.reply({ content: `You do not have the permissions to execute that command.`, ephemeral: true})
        }
    }
}

export{}