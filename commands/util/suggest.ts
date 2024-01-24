import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { database } = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Create a suggestion in the server to be voted on!')
        .addStringOption((option: any) => option.setName('suggestion').setDescription('What do you suggest?').setRequired(true)),
        async execute(interaction: any) {
            const {guild, id} = interaction;
            const channelId = await database({Action: 'getSuggestionChannel', guildId: guild.id}).catch((err: any) => console.log(err));
            const channel = await interaction.guild.channels.fetch(channelId);
            const suggestion = interaction.options.getString('suggestion');
            let suggestionEmbed = new EmbedBuilder()
                .setTitle('Status: ***Pending***')
                .setColor('#808080')
                .addFields(
                    { name: 'Suggestion', value: `${suggestion}`},
                    { name: 'Suggested By', value: `${interaction.user.username}`}
                )
                .setTimestamp();
            let yesButton = new ButtonBuilder()
                    .setCustomId('suggestYes')
                    .setLabel('✔️')
                    .setStyle(ButtonStyle.Success);
            let noButton = new ButtonBuilder()
                    .setCustomId('suggestNo')
                    .setLabel('❌')
                    .setStyle(ButtonStyle.Secondary);
            let row = new ActionRowBuilder()
                    .addComponents(yesButton, noButton);
            await channel.send({embeds: [suggestionEmbed], components: [row]}).catch((err: any) => console.log(err)).then((msg: any) => {
                let id = msg.id;
                let votesYes: any = [];
                let votesNo: any = [];
                database({Action: 'insertSuggestion', guildId: guild.id, data: {id, votesYes, votesNo}})
                interaction.reply({content: `Suggestion successfully sent.`, ephemeral: true})
            })
        }
}

export{}