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
        .setName('setsuggestions')
        .setDescription('Configure the suggestions channel.')
        .addChannelOption((option) => option.setName('channel').setDescription('What channel should the suggestions be sent to?').setRequired(true))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const { guild, id } = interaction;
            const channel = interaction.options.getChannel('channel');
            return yield database({ Action: 'setSuggestionChannel', guildId: guild.id, data: {
                    channel: channel.id,
                } }).catch((err) => interaction.reply({ content: `An error has occured ${err}`, ephemeral: true })).then((x) => {
                if (x) {
                    return interaction.reply({ content: `Successfully updated.`, ephemeral: true });
                }
            });
        });
    }
};
