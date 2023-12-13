const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { database } = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('unbans rule abiding users.')
        .addUserOption((option: any) => 
            option.setName('user').setDescription('Specify the user to be unbanned.').setRequired(true))
        .addStringOption((option: any) => 
            option.setName('reason').setDescription('Why is the user being unbanned?').setRequired(true))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers),
    async execute(interaction: any) {
        const { guild, id } = interaction;
        if(interaction.member.permissions.has(PermissionsBitField.Flags.BAN_MEMBERS)) {
            let member = interaction.options.getUser('user');
            let user = interaction.options.getUser('user');
            let reason = interaction.options.getString('reason')
            if(!member) return await interaction.reply({ content: 'That is an invalid user.', ephemeral: true});
            if(!reason) return await interaction.reply({ content: 'Please specify a unban reason.', ephemeral: true});
            let auditLogs = await database({Action: 'fetchAuditLogs', guildId: guild.id});
            let channel: any;
            if(auditLogs.enabled) {
                channel = await interaction.guild.channels.fetch(auditLogs.channel.id);
            }
            const unbanMessage = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('Administrative Action')
                    .setDescription(`${member} has been unbanned`)
                    .setAuthor({ name: 'ZotBot'})
                    .addFields(
                        { name: 'Reason', value: `${reason}`},
                        { name: 'Unbanned By', value: `${interaction.member}`},
                    )
                    .setTimestamp()
            await interaction.guild.members.unban(user.id).then(async (data: any, err: any) => {
                if(err) return await interaction.reply({ content: `[ERROR] Unban Failed. ${err}`, ephemeral:  true});
                channel.send({ embeds: [unbanMessage]});
                interaction.reply({content: `${member} has been Unbanned.`, ephemeral: true});
                const dbData = {
                    Action: 'Unban',
                    User: user.username,
                    Reason: reason,
                    Author: interaction.user.username,
                    timestamp: unbanMessage.data.timestamp,
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