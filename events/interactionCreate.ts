import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder, PermissionFlagsBits, PermissionsBitField } from "discord.js";
const { database } = require('../db.js');

var { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction: any) {
		if (interaction.isChatInputCommand()) {

			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
			}
		} else if(interaction.isButton()) {
			let id = interaction.customId
			if(id === 'createticket') {
				let channels = await interaction.guild.channels.fetch().catch((err: any) => {
					console.log(err)
				});
				let role = '';
				let categoryName = await database({Action: 'getTicketCategory', guildId: interaction.guild.id}).catch((err: any) => console.log(err))
				await interaction.guild.roles.fetch().catch((err: any) => console.log(err)).then((x: any) => {
					return x.map((f: any) => {
						if(f.name === '@everyone') {
							return role = f.id
						}
					})
				})
				let num = await database({Action: 'getTickets', guildId: interaction.guild.id}).catch((err: any) => console.log(err)).then((x: any) => {
					if(x === 'null' || x === null) {
						return 0.000
					} else {
						if(x[0]) {
							let length = x.length;
							let i = length - 1;
							let num = x[i].id;
							let arr = num.split('');
							arr[0] = arr[0] + '.'
							let newString = arr.join('')
							return newString;
						} else {
							let num = x.id
							let arr = num.split('');
							arr[0] = arr[0] + '.'
							let newString = arr.join('')
							return newString;
						}
						
					}
				})
				let num1 = parseFloat(num) + 0.001
				let numString = num1.toString()
				numString = numString.replace('.', '')
					let category: any = [];
					await channels.map((x: any) => {
						if(x.type === 4 && x.name === categoryName) {
							category.push(x)
						}
					});
					if(category[0]) {
						interaction.guild.channels.create({
							name: `ticket-${numString}`,
							type: ChannelType.GuildText,
							parent: category[0].id,
							permissionOverwrites: [
								{
									id: role,
									deny: [PermissionFlagsBits.ViewChannel]
								},
								{
									id: interaction.user.id,
									allow: [PermissionFlagsBits.ViewChannel]
								}
							]
						}).catch((err: any) => interaction.reply({content: `An error has occured`, ephemeral: true})).then(async (channel: any) => {
							let welcomeEmbed = new EmbedBuilder()
								.setTitle(`ticket-${numString}`)
								.setColor('Blue')
								.setDescription('A staff member will be with you shortly. Please describe the issue you are having in the most detail and we will do our best to assist you!')
								.setTimestamp()
							let closeTicket = new ButtonBuilder()
								.setCustomId('closeTicket')
								.setLabel('Close Ticket 🔒')
								.setStyle(ButtonStyle.Danger)
							let row = new ActionRowBuilder()
								.addComponents(closeTicket)
							await channel.send({embeds: [welcomeEmbed], components: [row]}).catch((err: any) => console.log(err))
							interaction.reply({content: `Ticket successfully created! ${channel}`, ephemeral: true})
							let data = {
								id: numString,
								author: interaction.user.id,
								channelId: channel.id
							}
							database({Action: 'insertTickets', guildId: interaction.guild.id, data}).catch((err: any) => console.log(err))
						})

					} else {
						await interaction.guild.channels.create({
							name: categoryName,
							type: ChannelType.GuildCategory,
							permissionOverwrites: [
								{
									id: role,
									deny: [PermissionFlagsBits.ViewChannel]
								},
							]
						}).catch((err: any) => console.log(err)).then((cat: any) => {
							let catId = cat.id;
							interaction.guild.channels.create({
								name: `ticket-${numString}`,
								type: ChannelType.GuildText,
								parent: catId,
								permissionOverwrites: [
									{
										id: role,
										deny: [PermissionFlagsBits.ViewChannel]
									},
									{
										id: interaction.user.id,
										allow: [PermissionFlagsBits.ViewChannel]
									}
								]
							}).catch((err: any) => interaction.reply({content: `An error has occured`, ephemeral: true})).then(async (channel: any) => {
								let welcomeEmbed = new EmbedBuilder()
									.setTitle(`ticket-${numString}`)
									.setColor('Blue')
									.setDescription('A staff member will be with you shortly. Please describe the issue you are having in the most detail and we will do our best to assist you!')
									.setTimestamp()
								let closeTicket = new ButtonBuilder()
									.setCustomId('closeTicket')
									.setLabel('Close Ticket 🔒')
									.setStyle(ButtonStyle.Danger)
								let row = new ActionRowBuilder()
									.addComponents(closeTicket)
								await channel.send({embeds: [welcomeEmbed], components: [row]}).catch((err: any) => console.log(err))
								interaction.reply({content: `Ticket successfully created! ${channel}`, ephemeral: true})
								let data = {
									id: numString,
									author: interaction.user.id,
									channelId: channel.id
								}
								database({Action: 'insertTickets', guildId: interaction.guild.id, data}).catch((err: any) => console.log(err));
							})
						})
					}
					
			} else if(id === 'closeTicket') { // Deletes all data
				let id = interaction.user.id;
				let member = await interaction.guild.members.fetch(id).catch((err: any) => console.log(err));
				let channelId = interaction.channelId; // Could use channel id to fetch all messages
				if(member.permissions.has(PermissionsBitField.Flags.Administrator)) {
					await interaction.guild.channels.delete(channelId, id).catch((err : any) => interaction.reply({content: `An error has occured please try again`, ephemeral: true})).then((x: any) => {
						interaction.reply({content: `Successfully closed.`, ephemeral: true})
					})
				} else {
					interaction.reply({content: `Sorry only an administrator can use that.`, ephemeral: true})
				}
			} else if(id === 'suggestYes') {
				let msgId = interaction.message.id;
				let data = { msgId }
				await database({Action: 'getSuggestion', guildId: interaction.guild.id, data}).catch((err: any) => console.log(err)).then(async (data: any) => {
					let { id, votesYes, votesNo } = data;
					let msg = await interaction.channel.messages.fetch(id);
					if(votesYes.length > 0 && votesYes.includes(interaction.user.id)) return interaction.reply({content: `You already voted.`, ephemeral: true})
					if(votesNo.length > 0 && votesNo.includes(interaction.user.id)) {
						votesNo.map((x: any, index: number) => {
							if(x === interaction.user.id) {
								return votesNo.splice(index, 1)
							}
						})
					}
					votesYes.push(interaction.user.id);
					let votes = votesYes.length;
					let comp = interaction.message.components[0].components;
					let button = comp.find((x: any) => {
						if(x.customId === 'suggestYes') {
							return x
						}
					});
					let button2 = comp.find((x: any) => {
						if(x.customId === 'suggestNo') {
							return x
						}
					});
					await database({Action: 'updateSuggestion', guildId: interaction.guild.id, data}).catch((err: any) => console.log(err));
					let text = button.label.split(' ')[0];
					let text2 = button2.label.split(' ')[0];
					let isNum = votes;
					let noText = text2;
					if(votesNo > 0) {
						noText = `${text} ${votesNo.length}`
					}
					if(isNum === 0) {
						let yesButton = new ButtonBuilder()
							.setCustomId('suggestYes')
							.setLabel(`✔️`)
							.setStyle(ButtonStyle.Success)
						let noButton = new ButtonBuilder()
							.setCustomId('suggestNo')
							.setLabel(noText)
							.setStyle(ButtonStyle.Secondary)
						let row = new ActionRowBuilder()
							.addComponents(yesButton, noButton)
						interaction.update({
							components : [row]
						})
						votesYes = [];
					} else {
						let num = isNum;
						if(!isNum) {
							num = 0;
						}
						
						let yesButton = new ButtonBuilder()
							.setCustomId('suggestYes')
							.setLabel(`${text} ${num}`)
							.setStyle(ButtonStyle.Success)
						let noButton = new ButtonBuilder()
							.setCustomId('suggestNo')
							.setLabel(noText)
							.setStyle(ButtonStyle.Secondary)
						let row = new ActionRowBuilder()
							.addComponents(yesButton, noButton)
						interaction.update({
							components : [row]
						})
					}
				})
			} else if(id === 'suggestNo') {
				let msgId = interaction.message.id;
				let data = { msgId }
				await database({Action: 'getSuggestion', guildId: interaction.guild.id, data}).catch((err: any) => console.log(err)).then(async (data: any) => {
					let { id, votesYes, votesNo } = data;
					let msg = await interaction.channel.messages.fetch(id);
					if(votesNo.length > 0 && votesNo.includes(interaction.user.id)) return interaction.reply({content: `You already voted.`, ephemeral: true})
					if(votesYes.length > 0 && votesYes.includes(interaction.user.id)) {
						votesYes.map((x: any, index: number) => {
							if(x === interaction.user.id) {
								return votesYes.splice(index, 1)
							}
						})
					}
					votesNo.push(interaction.user.id);
					let votes = votesNo.length;
					let comp = interaction.message.components[0].components;
					let button = comp.find((x: any) => {
						if(x.customId === 'suggestNo') {
							return x
						}
					});
					let button2 = comp.find((x: any) => {
						if(x.customId === 'suggestYes') {
							return x
						}
					});
					await database({Action: 'updateSuggestion', guildId: interaction.guild.id, data}).catch((err: any) => console.log(err))
					let text = button.label.split(' ')[0];
					let text2 = button2.label.split(' ')[0];
					let num = votes;
					let yesText = text2;
					if(votesYes.length > 0) {
						yesText = `${text} ${num}`
					}
					if(num === 0) {
						let yesButton = new ButtonBuilder()
							.setCustomId('suggestYes')
							.setLabel(yesText)
							.setStyle(ButtonStyle.Success)
						let noButton = new ButtonBuilder()
							.setCustomId('suggestNo')
							.setLabel(`${text}`)
							.setStyle(ButtonStyle.Secondary)
						let row = new ActionRowBuilder()
							.addComponents(yesButton, noButton)
						interaction.update({
							components : [row]
						})
						
					} else {
						if(!num) {
							num = 0;
						}
						
						let yesButton = new ButtonBuilder()
							.setCustomId('suggestYes')
							.setLabel(yesText)
							.setStyle(ButtonStyle.Success)
						let noButton = new ButtonBuilder()
							.setCustomId('suggestNo')
							.setLabel(`${text} ${num}`)
							.setStyle(ButtonStyle.Secondary)
						let row = new ActionRowBuilder()
							.addComponents(yesButton, noButton)
						interaction.update({
							components : [row]
						})
					}
					
				})
			}
		} else return;
	},
};

export{}