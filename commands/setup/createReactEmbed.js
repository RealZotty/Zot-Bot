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
        .setName('createreactembed')
        .setDescription('Create a reaction role embed for your server.')
        .addChannelOption((option) => option.setName('channel').setDescription('What channel should the embed be sent in?').setRequired(true))
        .addStringOption((option) => option.setName('title').setDescription('What is the title of your embed?').setRequired(true))
        .addStringOption((option) => option.setName('description').setDescription('What is the description of your embed?').setRequired(true))
        .addStringOption((option) => option.setName('url').setDescription('What URL do you want linked to the title?').setRequired(true))
        .addRoleOption((option) => option.setName('role').setDescription('What role should be given when they react?').setRequired(true))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = interaction.options.getChannel('channel');
            const title = interaction.options.getString('title');
            const description = interaction.options.getString('description');
            const url = interaction.options.getString('url');
            const role = interaction.options.getRole('role');
            const rulesEmbed = new EmbedBuilder()
                .setColor('#ff1100')
                .setTitle(title)
                .setDescription(description)
                .setURL(url)
                .setTimestamp();
            yield channel.send({ embeds: [rulesEmbed] }).then((msg) => {
                msg.react("✅");
                let rulesMsg = msg;
                rulesMsg.reactionRole = role;
                let res = database({ Action: 'setRulesEmbed', guildId: interaction.guild.id, data: {
                        rulesEmbed: rulesMsg,
                    } });
                if (res) {
                    interaction.reply({ content: `Embed successfully sent!`, ephemeral: true });
                }
                else {
                    interaction.reply({ content: `Something failed, please try again.`, ephemeral: true });
                }
            });
        });
    }
};
