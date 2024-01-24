"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { database } = require('../../db');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('mute rulebreaking users.')
        .addUserOption((option) => option.setName('user').setDescription('Specify the user to be muted.').setRequired(true))
        .addStringOption((option) => option.setName('reason').setDescription('Why is the user being muted?').setRequired(true))
        .addNumberOption((option) => option.setName('duration').setDescription('How long should the user be muted in minutes?').setRequired(true))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const { guild, id } = interaction;
            if (interaction.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
                let member = interaction.options.getMember('user');
                let user = interaction.options.getUser('user');
                let reason = interaction.options.getString('reason');
                let duration = interaction.options.getNumber('duration');
                if (!member)
                    return yield interaction.reply({ content: 'That is an invalid user.', ephemeral: true });
                if (member.permissions.has(PermissionsBitField.Flags.MuteMembers))
                    return yield interaction.reply({ content: `Sorry you cannot mute fellow admins. Please report any suspicious activity to a higher admin`, ephemeral: true });
                if (!reason)
                    return yield interaction.reply({ content: 'Please specify a mute reason.', ephemeral: true });
                let auditLogs = yield database({ Action: 'fetchAuditLogs', guildId: guild.id }).catch((err) => console.log(err));
                ;
                let channel;
                if (auditLogs.enabled) {
                    channel = yield interaction.guild.channels.fetch(auditLogs.channel.id);
                }
                const muteMessage = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('Administrative Action')
                    .setDescription(`${member} has been muted for ${duration} minutes.`)
                    .setAuthor({ name: 'ZotBot' })
                    .addFields({ name: 'Reason', value: `${reason}` }, { name: 'Muted By', value: `${interaction.member}` })
                    .setTimestamp();
                yield member.timeout(Number(duration) * 60 * 1000, reason).then((data, err) => __awaiter(this, void 0, void 0, function* () {
                    if (err)
                        return yield interaction.reply({ content: `[ERROR] Mute Failed. ${err}`, ephemeral: true });
                    channel.send({ embeds: [muteMessage] });
                    interaction.reply({ content: `${member} has been muted.`, ephemeral: true });
                    const dbData = {
                        Action: 'Mute',
                        User: user.username,
                        Reason: reason,
                        Author: interaction.user.username,
                        timestamp: muteMessage.data.timestamp,
                        guildId: guild.id,
                        duration: `${duration}m`
                    };
                    database(dbData);
                }));
            }
            else {
                yield interaction.reply({ content: `You do not have the permissions to execute that command.`, ephemeral: true });
            }
        });
    }
};
