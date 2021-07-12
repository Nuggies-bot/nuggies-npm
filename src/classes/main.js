/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const application = require('./applications');
let win;
const schema = require('../models/giveawayschema');
const { MessageButton } = require('discord-buttons');
const giveaways = require('./giveaways');
const Discord = require('discord.js');
const applications = require('./applications');
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
	/**
	 *
	 * @param {Discord.Client} client - The Discord Client
	 */
	static async handleinteractions(client) {
		if(!client) throw new Error('NuggiesError: client not provided');
		client.on('clickButton', async button => {
			await button.clicker.fetch();
			const id = button.id;
			if (id.startsWith('giveaways')) {
				const tag = id.split('-');
				if (tag[1] === 'enter') {
					const data = await schema.findOne({ messageID: button.message.id });
					if (data.requirements.enabled == true) {
						if (data.clickers.includes(button.clicker.user.id)) { return button.reply.send('you already entered this giveaway!', true); }
						const roles = data.requirements.roles.map(x => button.message.guild.members.cache.get(button.clicker.user.id).roles.cache.get(x));
						if (!roles[0]) {
							return button.reply.send(`You do not have the required role(s)\n${button.message.guild.roles.cache.filter(x => data.requirements.roles.includes(x.id)).filter(x => !button.message.guild.members.cache.get(button.clicker.user.id).roles.cache.get(x.id)).array().map(x => `\`${x.name}\``).join(', ')}\n for the giveaway!`, true);
						}
					}
					if (!data.clickers.includes(button.clicker.user.id)) {
						data.clickers.push(button.clicker.user.id);
						data.save();
						return button.reply.send('You have entered this giveaway! best of luck :)', true);
					}
				}
				if (tag[1] === 'reroll') {
					if (button.clicker.user.id !== tag[2]) return button.reply.send('You cannot end this giveaway as you didnt host it!', { ephemeral: true });
					try {
						button.defer();
						win = await giveaways.reroll(client, button.message.id);
					}
					catch (err) {
						console.log(err);
						return button.message.channel.send('unable to find the giveaway!');
					}
					if (!win.length) return button.message.channel.send('There are not enough people in the giveaway!');
					button.message.channel.send(`Rerolled! <@${win}> is the new winner of the giveaway!`, { component: new MessageButton().setLabel('Giveaway').setURL(`https://discord.com/channels/${button.message.guild.id}/${button.message.channel.id}/${button.message.id}`).setStyle('url') });
				}
				if (tag[1] === 'end') {
					if (button.clicker.user.id !== tag[2]) return button.reply.send('You cannot end this giveaway as you didnt host it!', { ephemeral: true });
					await giveaways.endByButton(client, button.message.id, button);
				}
				if (id.startsWith('br')) {
					let member;
					const fetchMem = await button.guild.members.fetch(button.clicker.member.id, false);
					if (fetchMem) member = button.guild.members.cache.get(button.clicker.member.id);
					await member.fetch(true);
					const role = id.split(':')[1];
					if (button.clicker.member.roles.cache.has(role)) {
						button.clicker.member.roles.remove(role);
						button.reply.send(`I have removed the <@&${role}> role from you!`, true);
					}
					else {
						button.clicker.member.roles.add(role);
						button.reply.send(`I have added the <@&${role}> role to you!`, true);
					}
				}
			}
		});
		client.on('clickMenu', async menu => {
			await menu.clicker.fetch();
			if(menu.id == 'app') {
				const app = menu.values[0];
				const data = await applications.getDataByGuild(menu.guild.id);
				console.log(data);
				const index = await data.applications.find(function(array) {
					return array.name === app;
				});
				const step = 0;
				const msg = await menu.clicker.user.send(new Discord.MessageEmbed().setTitle(`Application: ${app} \n question: 1/${index.questions.length}`));
				const collector = msg.channel.createMessageCollector({ max: index.questions.length + 1 });
				collector.on('collect', m => {
					console.log(m);
					for(let i = 0; i < app.questions.length + 1; i++) {
						console.log(i);
					}
				});
			}
			if(menu.id == 'dr') {
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
