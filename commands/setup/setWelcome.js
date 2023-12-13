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
        .setName('setwelcome')
        .setDescription('Add a custom greeting when members join your server.')
        .addChannelOption((option) => option.setName('channel').setDescription('What channel should the greeting be sent in?').setRequired(true))
        .addStringOption((option) => option.setName('message').setDescription('What message should be sent when a user joins the server?').setRequired(true))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const { guild, id } = interaction;
            let channelData = interaction.options.getChannel('channel');
            let message = interaction.options.getString('message');
            console.log(message);
            let channel = {
                id: channelData.id,
                name: channelData.name
            };
            let data = {
                Action: 'setWelcome',
                data: {
                    channel,
                    message,
                    guildId: guild.id
                }
            };
            const res = yield database(data);
            if (res === 200) {
                yield interaction.reply({ content: `Welcome message successfully set.`, ephemeral: true });
            }
            else {
                yield interaction.reply({ content: `[ERROR] Command Failed.`, ephemeral: true });
            }
        });
    }
};
