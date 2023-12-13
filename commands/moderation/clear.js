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
const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Bulk deletes messages in a channel')
        .addIntegerOption((option) => option.setName('number').setDescription('Number of messages you want deleted').setMaxValue(100).setRequired(true))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ADMINISTRATOR))
                return interaction.reply({ content: `You don't have permission to use this command`, ephemeral: true });
            let number = interaction.options.getInteger('number');
            if (isNaN(number))
                return interaction.reply({ content: `Numbers only`, ephemeral: true });
            if (number > 100)
                return interaction.reply({ content: `Max value 100`, ephemeral: true });
            interaction.channel.bulkDelete(number, false).then((messages) => interaction.reply({ content: `Successfully deleted ${messages.size} messages`, ephemeral: true })).catch((error) => interaction.reply({ content: `Sorry no messages were deleted due to **${error}**`, ephemeral: true }));
        });
    }
};
