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
const { database } = require('../db.js');
var { Events } = require('discord.js');
module.exports = {
    name: Events.InteractionCreate,
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (interaction.isChatInputCommand()) {
                const command = interaction.client.commands.get(interaction.commandName);
                if (!command) {
                    console.error(`No command matching ${interaction.commandName} was found.`);
                    return;
                }
                try {
                    yield command.execute(interaction);
                }
                catch (error) {
                    console.error(`Error executing ${interaction.commandName}`);
                    console.error(error);
                }
            }
            else if (interaction.isButton()) {
                let id = interaction.customId;
                if (id === 'createticket') {
                    let channels = yield interaction.guild.channels.fetch().catch((err) => {
                        console.log(err);
                    });
                    let role = '';
                    let categoryName = yield database({ Action: 'getTicketCategory', guildId: interaction.guild.id }).catch((err) => console.log(err));
                    yield interaction.guild.roles.fetch().catch((err) => console.log(err)).then((x) => {
                        return x.map((f) => {
                            if (f.name === '@everyone') {
                                return role = f.id;
                            }
                        });
                    });
                    let num = yield database({ Action: 'getTickets', guildId: interaction.guild.id }).catch((err) => console.log(err)).then((x) => {
                        console.log(x);
                        if (x === 'null' || x === null) {
                            return 0.000;
                        }
                        else {
                            if (x[0]) {
                                let length = x.length;
                                let i = length - 1;
                                let num = x[i].id;
                                let arr = num.split('');
                                arr[0] = arr[0] + '.';
                                let newString = arr.join('');
                                return newString;
                            }
                            else {
                                let num = x.id;
                                let arr = num.split('');
                                arr[0] = arr[0] + '.';
                                let newString = arr.join('');
                                return newString;
                            }
                        }
                    });
                    let num1 = parseFloat(num) + 0.001;
                    let numString = num1.toString();
                    numString = numString.replace('.', '');
                    let category = [];
                    yield channels.map((x) => {
                        if (x.type === 4 && x.name === categoryName) {
                            category.push(x);
                        }
                    });
                    if (category[0]) {
                        interaction.guild.channels.create({
                            name: `ticket-${numString}`,
                            type: discord_js_1.ChannelType.GuildText,
                            parent: category[0].id,
                            permissionOverwrites: [
                                {
                                    id: role,
                                    deny: [discord_js_1.PermissionFlagsBits.ViewChannel]
                                },
                                {
                                    id: interaction.user.id,
                                    allow: [discord_js_1.PermissionFlagsBits.ViewChannel]
                                }
                            ]
                        }).catch((err) => interaction.reply({ content: `An error has occured`, ephemeral: true })).then((channel) => __awaiter(this, void 0, void 0, function* () {
                            let welcomeEmbed = new discord_js_1.EmbedBuilder()
                                .setTitle(`ticket-${numString}`)
                                .setColor('Blue')
                                .setDescription('A staff member will be with you shortly. Please describe the issue you are having in the most detail and we will do our best to assist you!')
                                .setTimestamp();
                            let closeTicket = new discord_js_1.ButtonBuilder()
                                .setCustomId('closeTicket')
                                .setLabel('Close Ticket 🔒')
                                .setStyle(discord_js_1.ButtonStyle.Danger);
                            let row = new discord_js_1.ActionRowBuilder()
                                .addComponents(closeTicket);
                            yield channel.send({ embeds: [welcomeEmbed], components: [row] }).catch((err) => console.log(err));
                            interaction.reply({ content: `Ticket successfully created! ${channel}`, ephemeral: true });
                            let data = {
                                id: numString,
                                author: interaction.user.id,
                                channelId: channel.id
                            };
                            database({ Action: 'insertTickets', guildId: interaction.guild.id, data }).catch((err) => console.log(err));
                        }));
                    }
                    else {
                        yield interaction.guild.channels.create({
                            name: categoryName,
                            type: discord_js_1.ChannelType.GuildCategory,
                            permissionOverwrites: [
                                {
                                    id: role,
                                    deny: [discord_js_1.PermissionFlagsBits.ViewChannel]
                                },
                            ]
                        }).catch((err) => console.log(err)).then((cat) => {
                            let catId = cat.id;
                            interaction.guild.channels.create({
                                name: `ticket-${numString}`,
                                type: discord_js_1.ChannelType.GuildText,
                                parent: catId,
                                permissionOverwrites: [
                                    {
                                        id: role,
                                        deny: [discord_js_1.PermissionFlagsBits.ViewChannel]
                                    },
                                    {
                                        id: interaction.user.id,
                                        allow: [discord_js_1.PermissionFlagsBits.ViewChannel]
                                    }
                                ]
                            }).catch((err) => interaction.reply({ content: `An error has occured`, ephemeral: true })).then((channel) => __awaiter(this, void 0, void 0, function* () {
                                let welcomeEmbed = new discord_js_1.EmbedBuilder()
                                    .setTitle(`ticket-${numString}`)
                                    .setColor('Blue')
                                    .setDescription('A staff member will be with you shortly. Please describe the issue you are having in the most detail and we will do our best to assist you!')
                                    .setTimestamp();
                                let closeTicket = new discord_js_1.ButtonBuilder()
                                    .setCustomId('closeTicket')
                                    .setLabel('Close Ticket 🔒')
                                    .setStyle(discord_js_1.ButtonStyle.Danger);
                                let row = new discord_js_1.ActionRowBuilder()
                                    .addComponents(closeTicket);
                                yield channel.send({ embeds: [welcomeEmbed], components: [row] }).catch((err) => console.log(err));
                                interaction.reply({ content: `Ticket successfully created! ${channel}`, ephemeral: true });
                                let data = {
                                    id: numString,
                                    author: interaction.user.id,
                                    channelId: channel.id
                                };
                                database({ Action: 'insertTickets', guildId: interaction.guild.id, data });
                            }));
                        });
                    }
                }
                else if (id === 'closeTicket') { // Deletes all data
                    let id = interaction.user.id;
                    let member = yield interaction.guild.members.fetch(id).catch((err) => console.log(err));
                    let channelId = interaction.channelId; // Could use channel id to fetch all messages
                    if (member.permissions.has(discord_js_1.PermissionsBitField.Flags.Administrator)) {
                        yield interaction.guild.channels.delete(channelId, id).catch((err) => interaction.reply({ content: `An error has occured please try again`, ephemeral: true })).then((x) => {
                            interaction.reply({ content: `Successfully closed.`, ephemeral: true });
                        });
                    }
                    else {
                        interaction.reply({ content: `Sorry only an administrator can use that.`, ephemeral: true });
                    }
                }
            }
            else
                return;
        });
    },
};
