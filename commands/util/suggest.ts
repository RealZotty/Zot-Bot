import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
const { getImage } = require('../../functions/scrape.js')

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
            function validURL(str: string): Boolean {
                var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
                    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
                return !!pattern.test(str);
            }
            if(!validURL(suggestion.split(' ')[0])) {
                return interaction.reply({content: `The URL was invalid`, ephemeral: true})
            }
            interaction.reply({content: `Suggestion successfully sent!`, ephemeral: true})
            let url = null;
            let suggestionEmbed;
            if(suggestion.split(' ')[0].includes('gta5-mods.com')) {
                url = await getImage(suggestion.split(' ')[0]);
                suggestionEmbed = new EmbedBuilder()
                .setTitle('Status: ***Pending***')
                .setColor('#808080')
                .addFields(
                    { name: 'Suggestion', value: `${suggestion}`},
                    { name: 'Suggested By', value: `${interaction.user.username}`}
                )
                .setImage(url[0])
                .setTimestamp();
            } else {
                suggestionEmbed = new EmbedBuilder()
            .setTitle('Status: ***Pending***')
            .setColor('#808080')
            .addFields(
                { name: 'Suggestion', value: `${suggestion}`},
                { name: 'Suggested By', value: `${interaction.user.username}`}            )
            .setTimestamp();
            }
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
                return database({Action: 'insertSuggestion', guildId: guild.id, data: {id, votesYes, votesNo}})
            })
        }
}

export{}