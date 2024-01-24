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
const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { database } = require('../../db');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('createticketembed')
        .setDescription('Create a support ticket embed for your server.')
        .addChannelOption((option) => option.setName('channel').setDescription('What channel should the embed be sent in?').setRequired(true))
        .addStringOption((option) => option.setName('title').setDescription('What is the name of this ticket embed?').setRequired(true))
        .addStringOption((option) => option.setName('description').setDescription('What is the purpose of this embed?').setRequired(true))
        .addStringOption((option) => option.setName('category').setDescription('What do you want the name of the category where the tickets go to be called?'))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = interaction.options.getChannel('channel');
            const title = interaction.options.getString('title');
            const description = interaction.options.getString('description');
            const category = interaction.options.getString('category');
            yield database({ Action: 'setTicketCategory', guildId: interaction.guild.id, data: { category } }).catch((err) => console.log(err));
            const ticketEmbed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(description)
                .setColor('Blue')
                .setTimestamp();
            const openTicket = new ButtonBuilder()
                .setCustomId('createticket')
                .setLabel('Open Ticket 🎫')
                .setStyle(ButtonStyle.Success);
            const row = new discord_js_1.ActionRowBuilder()
                .addComponents(openTicket);
            yield channel.send({ embeds: [ticketEmbed], components: [row] }).catch((err) => interaction.reply({ content: `An error has occured check logs for details`, ephemeral: true })).then((msg) => {
                let id = msg.id;
                let guild = interaction.guild.id;
                msg.reply({ content: `Embed successfully sent!`, ephemeral: true });
            });
        });
    }
};
