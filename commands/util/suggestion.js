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
        .setName('suggestion')
        .setDescription('Decide weather a suggestion has been Accepted, Denied, or Implemented.')
        .addStringOption((option) => option.setName('id').setDescription('What is the ID of the suggestion message?').setRequired(true))
        .addStringOption((option) => option.setName('decision').setDescription('What is your decision?').setRequired(true).addChoices({ name: 'Accepted', value: 'accepted' }, { name: 'Denied', value: 'denied' }, { name: 'Implemented', value: 'implemented' }))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const { guild, id } = interaction;
            let msgId = interaction.options.getString('id');
            let choice = interaction.options.getString('decision');
            let channelId = yield database({ Action: 'getSuggestionChannel', guildId: guild.id }).catch((err) => interaction.reply({ content: `An error has occured ${err}`, ephemeral: true }));
            let channel = yield interaction.guild.channels.fetch(channelId);
            let msg = yield channel.messages.fetch(msgId);
            let fields = msg.embeds[0].data.fields;
            let data = yield database({ Action: 'getSuggestion', guildId: interaction.guild.id, data: { msgId } }).catch((err) => {
                return interaction.reply({ content: `Sorry this message wasn't found.`, ephemeral: true });
            });
            let title = msg.embeds[0].data.title;
            let url = null;
            if (msg.embeds[0].data.image) {
                url = msg.embeds[0].data.image.url;
            }
            if (title !== 'Status: ***Pending***')
                return interaction.reply({ content: `A decision has already been made`, ephemeral: true });
            let votes1 = data.votesYes.length;
            let votes2 = data.votesNo.length;
            if (choice === 'accepted') {
                let acceptedEmbed = new EmbedBuilder()
                    .setTitle('Status: [**Accepted**]')
                    .setColor('Green')
                    .addFields(...fields, {
                    name: 'Yes', value: votes1.toString(), inline: true
                }, {
                    name: 'No', value: votes2.toString(), inline: true
                })
                    .setTimestamp();
                if (url) {
                    acceptedEmbed = new EmbedBuilder()
                        .setTitle('Status: [**Accepted**]')
                        .setColor('Green')
                        .addFields(...fields, {
                        name: 'Yes', value: votes1.toString(), inline: true
                    }, {
                        name: 'No', value: votes2.toString(), inline: true
                    })
                        .setImage(url)
                        .setTimestamp();
                }
                msg.edit({
                    components: [],
                    embeds: [acceptedEmbed]
                }).catch((err) => interaction.reply({ content: `Uh Oh, we ran into ${err}`, ephemeral: true }));
                return interaction.reply({ content: `Embed successfully updated.`, ephemeral: true });
            }
            else if (choice === 'denied') {
                let deniedEmbed = new EmbedBuilder()
                    .setTitle('Status: [**Denied**]')
                    .setColor('Red')
                    .addFields(...fields, {
                    name: 'Yes', value: votes1.toString(), inline: true
                }, {
                    name: 'No', value: votes2.toString(), inline: true
                })
                    .setTimestamp();
                if (url) {
                    deniedEmbed = new EmbedBuilder()
                        .setTitle('Status: [**Denied**]')
                        .setColor('Red')
                        .addFields(...fields, {
                        name: 'Yes', value: votes1.toString(), inline: true
                    }, {
                        name: 'No', value: votes2.toString(), inline: true
                    })
                        .setImage(url)
                        .setTimestamp();
                }
                msg.edit({
                    components: [],
                    embeds: [deniedEmbed]
                }).catch((err) => interaction.reply({ content: `Uh Oh, we ran into ${err}`, ephemeral: true }));
                return interaction.reply({ content: `Embed successfully updated.`, ephemeral: true });
            }
            else if (choice === 'implemented') {
                let implementedEmbed = new EmbedBuilder()
                    .setTitle('Status: [**Implemented**]')
                    .setColor('#A020F0')
                    .addFields(...fields, {
                    name: 'Yes', value: votes1.toString(), inline: true
                }, {
                    name: 'No', value: votes2.toString(), inline: true
                })
                    .setTimestamp();
                if (url) {
                    implementedEmbed = new EmbedBuilder()
                        .setTitle('Status: [**Implemented**]')
                        .setColor('#A020F0')
                        .addFields(...fields, {
                        name: 'Yes', value: votes1.toString(), inline: true
                    }, {
                        name: 'No', value: votes2.toString(), inline: true
                    })
                        .setImage(url)
                        .setTimestamp();
                }
                msg.edit({
                    components: [],
                    embeds: [implementedEmbed]
                }).catch((err) => interaction.reply({ content: `Uh Oh, we ran into ${err}`, ephemeral: true }));
                return interaction.reply({ content: `Embed successfully updated.`, ephemeral: true });
            }
            else {
                return interaction.reply({ content: `Sorry ${choice} is invalid`, ephemeral: true });
            }
        });
    }
};
