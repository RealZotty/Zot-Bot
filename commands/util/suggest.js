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
const discord_js_1 = require("discord.js");
const { getImage } = require('../../functions/scrape.js');
const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { database } = require('../../db');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Create a suggestion in the server to be voted on!')
        .addStringOption((option) => option.setName('suggestion').setDescription('What do you suggest?').setRequired(true)),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const { guild, id } = interaction;
            const channelId = yield database({ Action: 'getSuggestionChannel', guildId: guild.id }).catch((err) => console.log(err));
            const channel = yield interaction.guild.channels.fetch(channelId);
            const suggestion = interaction.options.getString('suggestion');
            function validURL(str) {
                var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
                    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
                return !!pattern.test(str);
            }
            if (!validURL(suggestion.split(' ')[0])) {
                return interaction.reply({ content: `The URL was invalid`, ephemeral: true });
            }
            interaction.reply({ content: `Suggestion successfully sent!`, ephemeral: true });
            let url = null;
            let suggestionEmbed;
            if (suggestion.split(' ')[0].includes('gta5-mods.com')) {
                url = yield getImage(suggestion.split(' ')[0]);
                suggestionEmbed = new EmbedBuilder()
                    .setTitle('Status: ***Pending***')
                    .setColor('#808080')
                    .addFields({ name: 'Suggestion', value: `${suggestion}` }, { name: 'Suggested By', value: `${interaction.user.username}` })
                    .setImage(url[0])
                    .setTimestamp();
            }
            else {
                suggestionEmbed = new EmbedBuilder()
                    .setTitle('Status: ***Pending***')
                    .setColor('#808080')
                    .addFields({ name: 'Suggestion', value: `${suggestion}` }, { name: 'Suggested By', value: `${interaction.user.username}` })
                    .setTimestamp();
            }
            let yesButton = new discord_js_1.ButtonBuilder()
                .setCustomId('suggestYes')
                .setLabel('✔️')
                .setStyle(discord_js_1.ButtonStyle.Success);
            let noButton = new discord_js_1.ButtonBuilder()
                .setCustomId('suggestNo')
                .setLabel('❌')
                .setStyle(discord_js_1.ButtonStyle.Secondary);
            let row = new discord_js_1.ActionRowBuilder()
                .addComponents(yesButton, noButton);
            yield channel.send({ embeds: [suggestionEmbed], components: [row] }).catch((err) => console.log(err)).then((msg) => {
                let id = msg.id;
                let votesYes = [];
                let votesNo = [];
                return database({ Action: 'insertSuggestion', guildId: guild.id, data: { id, votesYes, votesNo } });
            });
        });
    }
};
