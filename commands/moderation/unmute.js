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
        .setName('unmute')
        .setDescription('unmute rule abiding users.')
        .addUserOption((option) => option.setName('user').setDescription('Specify the user to be unmuted.').setRequired(true))
        .addStringOption((option) => option.setName('reason').setDescription('Why is the user being umuted?').setRequired(true))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const { guild, id } = interaction;
            if (interaction.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
                let member = interaction.options.getMember('user');
                let user = interaction.options.getUser('user');
                let reason = interaction.options.getString('reason');
                if (!member)
                    return yield interaction.reply({ content: 'That is an invalid user.', ephemeral: true });
                if (!reason)
                    return yield interaction.reply({ content: 'Please specify a unmute reason.', ephemeral: true });
                let auditLogs = yield database({ Action: 'fetchAuditLogs', guildId: guild.id });
                let channel;
                if (auditLogs.enabled) {
                    channel = yield interaction.guild.channels.fetch(auditLogs.channel.id);
                }
                const unmuteMessage = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('Administrative Action')
                    .setDescription(`${member} has been unmuted`)
                    .setAuthor({ name: 'ZotBot' })
                    .addFields({ name: 'Reason', value: `${reason}` }, { name: 'Unmuted By', value: `${interaction.member}` })
                    .setTimestamp();
                yield member.timeout(null, reason).then((data, err) => __awaiter(this, void 0, void 0, function* () {
                    if (err)
                        return yield interaction.reply({ content: `[ERROR] Unmute Failed. ${err}`, ephemeral: true });
                    channel.send({ embeds: [unmuteMessage] });
                    interaction.reply({ content: `${member} has been unmuted.`, ephemeral: true });
                    const dbData = {
                        Action: 'Unmute',
                        User: user.username,
                        Reason: reason,
                        Author: interaction.user.username,
                        timestamp: unmuteMessage.data.timestamp,
                        guildId: guild.id,
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
