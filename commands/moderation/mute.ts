const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { database } = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('mute rulebreaking users.')
        .addUserOption((option: any) => 
            option.setName('user').setDescription('Specify the user to be muted.').setRequired(true))
        .addStringOption((option: any) => 
            option.setName('reason').setDescription('Why is the user being muted?').setRequired(true))
        .addNumberOption((option: any) =>
            option.setName('duration').setDescription('How long should the user be muted in minutes?').setRequired(true))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers),
    async execute(interaction: any) {
        const { guild, id } = interaction;
        if(interaction.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
            let member = interaction.options.getMember('user');
            let user = interaction.options.getUser('user');
            let reason = interaction.options.getString('reason');
            let duration = interaction.options.getNumber('duration');
            if(!member) return await interaction.reply({ content: 'That is an invalid user.', ephemeral: true});
            if(member.permissions.has(PermissionsBitField.Flags.MuteMembers)) return await interaction.reply({ content: `Sorry you cannot mute fellow admins. Please report any suspicious activity to a higher admin`, ephemeral: true})
            if(!reason) return await interaction.reply({ content: 'Please specify a mute reason.', ephemeral: true});
            let auditLogs = await database({Action: 'fetchAuditLogs', guildId: guild.id}).catch((err: any) => console.log(err));;
            let channel: any;
            if(auditLogs.enabled) {
                channel = await interaction.guild.channels.fetch(auditLogs.channel.id);
            }
            const muteMessage = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('Administrative Action')
                    .setDescription(`${member} has been muted for ${duration} minutes.`)
                    .setAuthor({ name: 'ZotBot'})
                    .addFields(
                        { name: 'Reason', value: `${reason}`},
                        { name: 'Muted By', value: `${interaction.member}`},
                    )
                    .setTimestamp()
            await member.timeout(Number(duration) * 60 * 1000, reason).then(async (data: any, err: any) => {
                if(err) return await interaction.reply({ content: `[ERROR] Mute Failed. ${err}`, ephemeral:  true});
                channel.send({ embeds: [muteMessage]});
                interaction.reply({content: `${member} has been muted.`, ephemeral: true});
                const dbData = {
                    Action: 'Mute',
                    User: user.username,
                    Reason: reason,
                    Author: interaction.user.username,
                    timestamp: muteMessage.data.timestamp,
                    guildId: guild.id,
                    duration: `${duration}m`
                }
                database(dbData)
            });
        } else {
            await interaction.reply({ content: `You do not have the permissions to execute that command.`, ephemeral: true})
        }
    }
}

export{}