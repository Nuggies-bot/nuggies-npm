const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const applications = require('./applications');
let win;
const schema = require('../models/giveawayschema');
const { MessageButton } = require('discord-buttons');
const giveaways = require('./giveaways');
const Discord = require('discord.js');

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
			await button.clicker.fetch();
			const id = button.id;
			if (id.startsWith('giveaways')) {
				const tag = id.split('-');
				if (tag[1] === 'enter') {
					const data = await schema.findOne({ messageID: button.message.id });
					if (data.requirements.enabled == true) {
						if (data.clickers.includes(button.clicker.user.id)) { return button.reply.send(client.giveawayMessages.alreadyParticipated, true); }
						const roles = data.requirements.roles.map(x => button.message.guild.members.cache.get(button.clicker.user.id).roles.cache.get(x));
						if (!roles[0]) {
							const requiredRoles = button.message.guild.roles.cache.filter(x => data.requirements.roles.includes(x.id)).filter(x => !button.message.guild.members.cache.get(button.clicker.user.id).roles.cache.get(x.id)).array().map(x => `\`${x.name}\``).join(', ');
							return button.reply.send(client.giveawayMessages.nonoRole.replace(/{requiredRoles}/g, requiredRoles), true);
						}
					}
					if (!data.clickers.includes(button.clicker.user.id)) {
						data.clickers.push(button.clicker.user.id);
						data.save();
						return button.reply.send(client.giveawayMessages.newParticipant, true);
					}
					if (data.clickers.includes(button.clicker.user.id)) {
						return button.reply.send(client.giveawayMessages.alreadyParticipated, true);
					}
				}
				if (tag[1] === 'reroll') {
					if (button.clicker.user.id !== tag[2]) return button.reply.send('You Cannot End This Giveaway, Only Hoster Can', { ephemeral: true });
					try {
						button.reply.send('Rerolled!', true);
						win = await giveaways.reroll(client, button.message.id);
					}
					catch (err) {
						console.log(err);
						return button.message.channel.send('⚠️ **Unable To Find That Giveaway**');
					}
					if (!win.length) return button.message.channel.send(client.giveawayMessages.nonoParticipants);
					button.message.channel.send(client.giveawayMessages.rerolledMessage.replace(/{winner}/g, `<@${win}>`), { component: new MessageButton().setLabel('Giveaway').setURL(`https://discord.com/channels/${button.message.guild.id}/${button.message.channel.id}/${button.message.id}`).setStyle('url') });
				}
				if (tag[1] === 'end') {
					button.reply.defer();
					if (button.clicker.user.id !== tag[2]) return button.reply.send('You Cannot End This Giveaway, Only Hoster Can', { ephemeral: true });
					await giveaways.endByButton(client, button.message.id, button);
				}
			}
		});
		client.on('clickMenu', async menu => {
			await menu.clicker.fetch();
			if (menu.id == 'app') {
				const app = menu.values[0];
				const data = await applications.getDataByGuild(menu.guild.id);
				const index = await data.applications.find((application) => {
					return application.name === app;
				});
				let step = 0;
				const embed = new Discord.MessageEmbed().setColor('RANDOM').setTitle(`Application: ${app}`).setFooter(`Question: 1/${index.questions.length}`);
				const msg = await menu.clicker.user.send(embed.setDescription(index.questions[0]));
				const collector = msg.channel.createMessageCollector(m => !m.author.bot, { max: index.questions.length });
				const res = { userID: menu.clicker.user.id, answers: [] };
				collector.on('collect', m => {
					if (!m.content) return collector.stop('ERROR');
					res.answers
						.push({ question: index.questions[step], answer: m.content });
					step++;
					if (step == index.questions.length) {
						m.channel.send('Your application has been completed!');
						return collector.stop('DONE');
					}
					msg.channel.send(embed.setDescription(index.questions[step]).setFooter(`Question: ${step + 1}/${index.questions.length}`));
				});
				collector.on('end', async (msgs, reason) => {
					if (reason == 'ERROR') {
						return msg.channel.send('That is not a valid answer');
					}
					if (reason == 'DONE') {
						const newdata = await schema.findOne({ guildID: menu.message.guild.id });
						newdata.responses.push(res);
						await newdata.save();
					}
				});
			}
			if (menu.id == 'dr') {
				let member;
				const fetchMem = await menu.guild.members.fetch(menu.clicker.member.id, false);
				if (fetchMem) member = menu.guild.members.cache.get(menu.clicker.member.id);
				await member.fetch(true);
				const role = menu.values[0];
				if (menu.clicker.member.roles.cache.has(role)) {
					menu.clicker.member.roles.remove(role);
					menu.reply.send(`I have removed the <@&${role}> role from you!`, true);
				}
				else {
					menu.clicker.member.roles.add(role);
					menu.reply.send(`I have added the <@&${role}> role to you!`, true);
				}
			}
		});
	}
}
module.exports = main;