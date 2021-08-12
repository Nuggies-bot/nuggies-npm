/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const applications = require('./applications');
let win;
const schema = require('../../models/giveawayschema');
const giveaways = require('./giveaways');
const Discord = require('discord.js');
const ms = require('ms');

class main {
	/**
		*
		* @param {string} url - MongoDB connection URI.
		*/
	static async connect(url) {
		if (!url) throw new TypeError('NuggiesError: You didn\'t provide a MongoDB connection string');
		return mongoose.connect(url, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
	}
	static async handleInteractions(client) {
		if (!client) throw new Error('NuggiesError: client not provided');
		client.on('clickButton', async button => {
			await button.member.fetch();
			const id = button.customId;
			if (id.startsWith('giveaways')) {
				const tag = id.split('-');
				if (tag[1] === 'enter') {
					const data = await schema.findOne({ messageID: button.message.id });
					if (data.requirements.enabled == true) {
						if (data.clickers.includes(button.clicker.user.id)) { return button.reply({ content: client.customMessages.giveawayMessages.alreadyParticipated, ephemeral: true }); }
						const roles = data.requirements.roles.map(x => button.guild.members.cache.get(button.user.id).roles.cache.get(x));
						if (!roles[0]) {
							const requiredRoles = button.guild.roles.cache.filter(x => data.requirements.roles.includes(x.id)).filter(x => !button.guild.members.cache.get(button.user.id).roles.cache.get(x.id)).array().map(x => `\`${x.name}\``).join(', ');
							return button.reply({ content: client.customMessages.giveawayMessages.nonoRole.replace(/{requiredRoles}/g, requiredRoles), ephemeral: true });
						}
					}
					if (!data.clickers.includes(button.user.id)) {
						data.clickers.push(button.user.id);
						data.save();
						return button.reply({ content: client.customMessages.giveawayMessages.newParticipant, ephemeral: true });
					}
					if (data.clickers.includes(button.user.id)) {
						return button.reply({ content: client.customMessages.giveawayMessages.alreadyParticipated, ephemeral: true });
					}
				}
				if (tag[1] === 'reroll') {
					if (button.user.id !== tag[2]) return button.reply({ ephemeral: true, content: 'You Cannot End This Giveaway, Only The Host Can' });
					try {
						button.reply({ content: 'Rerolled!', ephemeral: true });
						win = await giveaways.reroll(client, button.message.id);
					}
					catch (err) {
						console.log(err);
						return button.message.channel.send('⚠️ **Unable To Find That Giveaway**');
					}
					if (!win.length) return button.message.channel.send(client.customMessages.giveawayMessages.nonoParticipants);
					button.message.channel.send({ content: client.customMessages.giveawayMessages.rerolledMessage.replace(/{winner}/g, `<@${win}>`), components: [new Discord.MessageActionRow().addComponents([new Discord.MessageButton().setLabel('Giveaway').setURL(`https://discord.com/channels/${button.message.guild.id}/${button.message.channel.id}/${button.message.id}`).setStyle('LINK')])] });
				}
				if (tag[1] === 'end') {
					button.deferReply();
					if (button.user.id !== tag[2]) return button.reply({ content: 'You Cannot End This Giveaway, Only The Host Can', ephemeral: true });
					await giveaways.endByButton(client, button.message.id, button);
				}
			}
			if (id.startsWith('br')) {
				let member;
				const fetchMem = await button.guild.members.fetch(button.member.id, false);
				if (fetchMem) member = button.guild.members.cache.get(button.member.id);
				await member.fetch(true);
				const role = id.split(':')[1];
				if (button.member.roles.cache.has(role)) {
					button.member.roles.remove(role);
					button.reply({ content: `I have removed the <@&${role}> role from you!`, ephemeral: true });
				}
				else {
					button.member.roles.add(role);
					button.reply({ content: `I have added the <@&${role}> role to you!`, ephemeral: true });
				}
			}
		});
		client.on('clickMenu',
			/**
			 * @param {MessageComponent} menu
			 */
			async menu => {
				await menu.member.fetch();
				if (menu.customId == 'app') {
					const app = menu.values[0];
					const data = await applications.getDataByGuild(menu.guild.id);
					if (!data) return menu.reply({ content: 'Something went wrong!', ephemeral: true });
					const last = data.responses.find(x => x.userID == menu.user.id);
					if (last) {
						if ((Date.now() - last.createdAt) < data.applicationCooldown) return menu.reply({ content: `You cannot create another application for ${ms((last.createdAt + data.applicationCooldown) - Date.now(), { long: true })}`, ephemeral: true });
					}
					const responses = data.responses.filter(x => x.userID == menu.user.id && x.accepted == undefined && x.declined == undefined);
					if (responses.length == data.maxApplicationsFromUser) return menu.reply({ content: 'You cannot submit any more responses as you have reached the limit', ephemeral: true });
					const index = await data.applications.find((application) => {
						return application.name === app;
					});
					let step = 0;
					const embed = new Discord.MessageEmbed().setColor('RANDOM').setTitle(`Application: ${app}`).setFooter(`Question: 1/${index.questions.length}`);
					const msg = await menu.user.send({ embeds: [embed.setDescription(index.questions[0])] });
					const collector = msg.channel.createMessageCollector({ filter: m => !m.author.bot, max: index.questions.length });
					const res = { userID: menu.user.id, answers: [], createdAt: Date.now(), app };
					collector.on('collect', m => {
						if (!m.content) return collector.stop('ERROR');
						res.answers
							.push({ question: index.questions[step], answer: m.content });
						step++;
						if (step == index.questions.length) {
							m.channel.send('Your application has been completed!');
							return collector.stop('DONE');
						}
						msg.channel.send({ embeds: [embed.setDescription(index.questions[step]).setFooter(`Question: ${step + 1}/${index.questions.length}`)] });
					});
					collector.on('end', async (msgs, reason) => {
						if (reason == 'ERROR') {
							return msg.channel.send('That is not a valid answer');
						}
						if (reason == 'DONE') {
							const newdata = await applications.getDataByGuild(menu.message.guild.id);
							newdata.responses.push(res);
							await newdata.save();
							const c = await client.channels.fetch(data.responseChannel, true, false);
							if (!c) return;
							c.send({ embeds: [new Discord.MessageEmbed().setTitle('New response').setDescription(`Application: ${app}\nUser: ${menu.clicker.user} - \`${menu.clicker.user.id}\``).addFields(res.answers.map(x => { return { name: `Question: ${x.question}`, value: `Answer: ${x.answer}`, inline: true }; })).setColor('RANDOM').setFooter(menu.clicker.user.tag, menu.clicker.user.displayAvatarURL())] });
						}
					});
					menu.reply({ content: `Check your DMs! Or click this link ${msg.url}`, ephemeral: true });
				}
				if (menu.customId == 'dr') {
					let member;
					const fetchMem = await menu.guild.members.fetch(menu.member.id, false);
					if (fetchMem) member = menu.guild.members.cache.get(menu.member.id);
					await member.fetch(true);
					const role = menu.values[0];
					if (menu.member.roles.cache.has(role)) {
						menu.member.roles.remove(role);
						menu.reply(`I have removed the <@&${role}> role from you!`, true);
					}
					else {
						menu.member.roles.add(role);
						menu.reply(`I have added the <@&${role}> role to you!`, true);
					}
				}
			});
	}
}
module.exports = main;


function replacePlaceholders(string, button, role) {
	const newString = string.replace(/{guildName}/g, button.message.guild.name).replace(/{clicker}/g, button.user.username).replace(/{role}/g, role);
	return newString;
}