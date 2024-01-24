import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { database } = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggestion')
        .setDescription('Decide weather a suggestion has been Accepted, Denied, or Implemented.')
        .addStringOption((option: any) => option.setName('id').setDescription('What is the ID of the suggestion message?').setRequired(true))
        .addStringOption((option: any) => option.setName('decision').setDescription('What is your decision?').setRequired(true).addChoices( {name: 'Accepted', value: 'accepted'}, {name: 'Denied', value: 'denied'}, {name: 'Implemented', value: 'implemented'}))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    async execute(interaction: any) {
        const {guild, id} = interaction;
        let msgId = interaction.options.getString('id');
        let choice = interaction.options.getString('decision');
        let channelId = await database({Action: 'getSuggestionChannel', guildId: guild.id}).catch((err: any) => interaction.reply({content: `An error has occured ${err}`, ephemeral: true}));
        let channel = await interaction.guild.channels.fetch(channelId);
        let msg = await channel.messages.fetch(msgId);
        let fields = msg.embeds[0].data.fields;
        let data = await database({Action: 'getSuggestion', guildId: interaction.guild.id, data: {msgId}}).catch((err: any) => {
            return interaction.reply({content: `Sorry this message wasn't found.`, ephemeral: true})
        });
        let title = msg.embeds[0].data.title;
        if(title !== 'Status: ***Pending***') return interaction.reply({content: `A decision has already been made`, ephemeral: true})
        let votes1 = data.votesYes.length;
        let votes2 = data.votesNo.length;
        if(choice === 'accepted') {
            let acceptedEmbed = new EmbedBuilder()
                .setTitle('Status: [**Accepted**]')
                .setColor('Green')
                .addFields(...fields, {
                    name: 'Yes', value: votes1.toString(), inline: true
                }, {
                    name: 'No', value: votes2.toString(), inline: true
                })
                .setTimestamp();
            msg.edit({
                components: [],
                embeds: [acceptedEmbed]
            }).catch((err: any) => interaction.reply({content: `Uh Oh, we ran into ${err}`, ephemeral: true}))
            return interaction.reply({content: `Embed successfully updated.`, ephemeral: true})
        } else if(choice === 'denied') {
            let deniedEmbed = new EmbedBuilder()
                .setTitle('Status: [**Denied**]')
                .setColor('Red')
                .addFields(...fields, {
                    name: 'Yes', value: votes1.toString(), inline: true
                }, {
                    name: 'No', value: votes2.toString(), inline: true
                })
                .setTimestamp();
            msg.edit({
                components: [],
                embeds: [deniedEmbed]
            }).catch((err: any) => interaction.reply({content: `Uh Oh, we ran into ${err}`, ephemeral: true}))
            return interaction.reply({content: `Embed successfully updated.`, ephemeral: true})
        } else if(choice === 'implemented') {
            let implementedEmbed = new EmbedBuilder()
                .setTitle('Status: [**Implemented**]')
                .setColor('#A020F0')
                .addFields(...fields, {
                    name: 'Yes', value: votes1.toString(), inline: true
                }, {
                    name: 'No', value: votes2.toString(), inline: true
                })
                .setTimestamp();
            msg.edit({
                components: [],
                embeds: [implementedEmbed]
            }).catch((err: any) => interaction.reply({content: `Uh Oh, we ran into ${err}`, ephemeral: true}))
            return interaction.reply({content: `Embed successfully updated.`, ephemeral: true})
        } else {
            return interaction.reply({content: `Sorry ${choice} is invalid`, ephemeral: true})
        }
    }
}

export{}