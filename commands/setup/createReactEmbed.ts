const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { database } = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createreactembed')
        .setDescription('Create a reaction role embed for your server.')
        .addChannelOption((option: any) => 
            option.setName('channel').setDescription('What channel should the embed be sent in?').setRequired(true))
            .addStringOption((option: any) =>
                option.setName('title').setDescription('What is the title of your embed?').setRequired(true)
            )
            .addStringOption((option: any) => 
                option.setName('description').setDescription('What is the description of your embed?').setRequired(true)
            )
            .addStringOption((option: any) => 
                option.setName('url').setDescription('What URL do you want linked to the title?').setRequired(true)
            )
            .addRoleOption((option: any) => 
                option.setName('role').setDescription('What role should be given when they react?').setRequired(true)
            )
            .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    async execute (interaction: any) {
        const channel = interaction.options.getChannel('channel');
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');
        const url = interaction.options.getString('url');
        const role = interaction.options.getRole('role');
        console.log(title, description, url)
        const rulesEmbed = new EmbedBuilder()
            .setColor('#ff1100')
            .setTitle(title)
            .setDescription(description)
            .setURL(url)
            .setTimestamp()
        await channel.send({embeds: [rulesEmbed]}).then((msg: any) => {
            msg.react("✅");
            let rulesMsg = msg;
            rulesMsg.reactionRole = role;
            database({Action: 'setRulesEmbed', guildId: interaction.guild.id, data: {
                rulesEmbed: rulesMsg,
            }})
        })
    }
}

export{}