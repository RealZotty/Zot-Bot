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
const { Events } = require('discord.js');
const { database } = require('../db');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
module.exports = {
    name: Events.MessageUpdate,
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(interaction);
            let author = yield interaction.author;
            let member = yield interaction.guild.members.fetch(author.id);
            if (author.bot)
                return;
            if (member.permissions.has(PermissionsBitField.Flags.MUTE_MEMBERS))
                return;
            let message = yield interaction.reactions.message.content;
            let bannedList = yield database({ Action: 'fetchBannedWords', guildId: interaction.guild.id }).catch((err) => console.log(err));
            ;
            let bannedWords = bannedList.bannedWords.toLowerCase().split(', ');
            let auditLogs = yield database({ Action: 'fetchAuditLogs', guildId: interaction.guild.id }).catch((err) => console.log(err));
            ;
            let channel;
            if (auditLogs.enabled) {
                channel = yield interaction.guild.channels.fetch(auditLogs.channel.id);
            }
            function validURL(str) {
                var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
                    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
                return !!pattern.test(str);
            }
            bannedWords.map((x) => {
                if (validURL(x) && message.includes(x)) {
                    interaction.delete().catch((err) => console.log(err));
                    const deleteEmbedBuilder = new EmbedBuilder()
                        .setColor('Red')
                        .setTitle('Advertisement Detected')
                        .addFields({
                        name: 'User', value: `${interaction.author.username}`
                    }, {
                        name: `User's ID`, value: `${interaction.author.id}`
                    }, {
                        name: 'Advertisment', value: `${x}`
                    })
                        .setTimestamp();
                    channel.send({ embeds: [deleteEmbedBuilder] });
                    return interaction.channel.send(`${interaction.member} We don't use those links here.`).then((msg) => {
                        return setTimeout(() => msg.delete().catch((err) => console.log(err)), 10000);
                    });
                }
                else if (message.includes(x)) {
                    interaction.delete().catch((err) => console.log(err));
                    const deleteEmbedBuilder = new EmbedBuilder()
                        .setColor('Red')
                        .setTitle('Banned Word Detected')
                        .addFields({
                        name: 'User', value: `${interaction.author.username}`
                    }, {
                        name: `User's ID`, value: `${interaction.author.id}`
                    }, {
                        name: 'Banned Word', value: `${x}`
                    })
                        .setTimestamp();
                    channel.send({ embeds: [deleteEmbedBuilder] });
                    return interaction.channel.send(`${interaction.member} We don't use that word here.`).then((msg) => {
                        return setTimeout(() => msg.delete().catch((err) => console.log(err)), 10000);
                    });
                }
            });
        });
    }
};
