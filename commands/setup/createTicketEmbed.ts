import { ActionRowBuilder } from "discord.js";

const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { database } = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createticketembed')
        .setDescription('Create a support ticket embed for your server.')
        .addChannelOption((option: any) => 
            option.setName('channel').setDescription('What channel should the embed be sent in?').setRequired(true))
        .addStringOption((option: any) => option.setName('title').setDescription('What is the name of this ticket embed?').setRequired(true))
        .addStringOption((option: any) => option.setName('description').setDescription('What is the purpose of this embed?').setRequired(true))
        .addStringOption((option: any) => option.setName('category').setDescription('What do you want the name of the category where the tickets go to be called?'))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    async execute (interaction: any) {
        const channel = interaction.options.getChannel('channel');
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');
        const category = interaction.options.getString('category');
        await database({Action: 'setTicketCategory', guildId: interaction.guild.id, data: { category }}).catch((err: any) => console.log(err))
        const ticketEmbed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor('Blue')
            .setTimestamp();
        const openTicket = new ButtonBuilder()
            .setCustomId('createticket')
            .setLabel('Open Ticket 🎫')
            .setStyle(ButtonStyle.Success);
        const row = new ActionRowBuilder()
            .addComponents(openTicket);
        await channel.send({embeds: [ticketEmbed], components: [row]}).catch((err: any) => interaction.reply({content: `An error has occured check logs for details`, ephemeral: true})).then((msg: any) => {
            let id = msg.id;
            let guild = interaction.guild.id;
            msg.reply({content: `Embed successfully sent!`, ephemeral: true})
        })
        
    }
}

export{}