const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { database } = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('kick rulebreaking users.')
        .addUserOption((option: any) => 
            option.setName('user').setDescription('Specify the user to be kicked.').setRequired(true))
        .addStringOption((option: any) => 
            option.setName('reason').setDescription('Why is the user being kicked?').setRequired(true))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers),
    async execute(interaction: any) {
        const { guild, id } = interaction;
        if(interaction.member.permissions.has(PermissionsBitField.Flags.KICK_MEMBERS)) {
            let member = interaction.options.getMember('user');
            let user = interaction.options.getUser('user');
            let reason = interaction.options.getString('reason')
            if(!member) return await interaction.reply({ content: 'That is an invalid user.', ephemeral: true});
            if(member.permissions.has(PermissionsBitField.Flags.MuteMembers)) return await interaction.reply({ content: `Sorry you cannot kick fellow admins. Please report any suspicious activity to a higher admin`, ephemeral: true})
            if(!reason) return await interaction.reply({ content: 'Please specify a kick reason.', ephemeral: true})
            let auditLogs = await database({Action: 'fetchAuditLogs', guildId: guild.id}).catch((err: any) => console.log(err));;
            let channel: any;
            if(auditLogs.enabled) {
                channel = await interaction.guild.channels.fetch(auditLogs.channel.id);
            }
            const kickMessage = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('Administrative Action')
                    .setDescription(`${member} has been kicked`)
                    .setAuthor({ name: 'ZotBot'})
                    .addFields(
                        { name: 'Reason', value: `${reason}`},
                        { name: 'Kicked By', value: `${interaction.member}`},
                    )
                    .setTimestamp()
            await member.kick({ reason }).then(async (data: any, err: any) => {
                if(err) return await interaction.reply({ content: `[ERROR] Kick Failed. ${err}`, ephemeral:  true});
                channel.send({ embeds: [kickMessage]});
                interaction.reply({content: `${member} has been kicked.`, ephemeral: true});
                const dbData = {
                    Action: 'Kick',
                    User: user.username,
                    Reason: reason,
                    Author: interaction.user.username,
                    timestamp: kickMessage.data.timestamp,
                    guildId: guild.id,
                }
                database(dbData)
            });
        } else {
            await interaction.reply({ content: `You do not have the permissions to execute that command.`, ephemeral: true})
        }
    }
};

export{}