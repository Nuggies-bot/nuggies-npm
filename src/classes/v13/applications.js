const { MessageEmbed, MessageSelectMenu, MessageActionRow } = require('discord.js');
const schema = require('../../models/applictionsschema');
const ms = require('ms');
// eslint-disable-next-line no-unused-vars
const { Document } = require('mongoose');

class Applications {
	/**
	 * @param {Array} questions - Questions array
	 * @param {String} name - the application name
	 * @param {String} emoji - the dropdown emoji ID or unicode
	 * @param {String} channel - the channel ID of the channel which will recieve the answers
	 * @param {String} description - the description of the dropdown
	 * @param {String} label - The dropdown label
	 * @param {Number} maxApps - The amount of responses
	 */
	static async addApplication({ guildID, questions, name, emoji, channel, description, label, maxApps, cooldown, responseChannelID }) {
		if (!guildID) throw new Error('NuggiesError: guildID not provided');
		if (!questions) throw new Error('NuggiesError: questions Array not provided');
		if (!name) throw new Error('NuggiesError: name not provided');
		if (!channel) throw new Error('NuggiesError: channel ID not provided');
		if (!description) throw new Error('NuggiesError: description not provided');
		if (!label) throw new Error('NuggiesError: label not provided');
		if (typeof guildID !== 'string') throw new Error('NuggiesError: guildID must be a string');
		if (!Array.isArray(questions)) throw new Error('NuggiesError: questions must be an array');
		if (typeof name !== 'string') throw new Error('NuggiesError: name must be a string');
		if (typeof emoji !== 'string') throw new Error('NuggiesError: emoji must be a string');
		if (typeof channel !== 'string') throw new Error('NuggiesError: channel must be a string');
		if (typeof description !== 'string') throw new Error('NuggiesError: description must be a string');
		if (typeof label !== 'string') throw new Error('NuggiesError: label must be a string');
		if (maxApps && typeof maxApps !== 'number') throw new Error('NuggiesError: maxApps must be a number');
		if (cooldown && typeof cooldown !== 'number') throw new Error('NuggiesError: cooldown must be a number');
		if (typeof responseChannelID !== 'string') throw new Error('NuggiesError: responseChannelID must be a string');

		if (cooldown) cooldown = ms(cooldown);

		const object = {
			name: name,
			questions: questions,
			description: description,
			label: label,
			emoji: emoji ? emoji : null,
		};
		let data = await schema.findOne({ guildID: guildID });
		if (!data) {
			data = new schema({
				guildID: guildID,
				channelID: channel,
				applications: [object],
				maxApplicationsFromUser: maxApps,
				applicationCooldown: cooldown,
				responseChannel: responseChannelID,
			});
		}
		else if (data) {
			data.applications.push(object);
			if (cooldown) data.applicationCooldown = cooldown;
			if (maxApps) data.maxApplicationsFromUser = maxApps;
		}
		data.save();
		return data;
	}
	static async deleteApplication({ guildID, name }) {
		const data = await schema.findOne({ guildID: guildID });
		if (!data) return false;
		if (!data.applications.includes(name)) return false;
		// eslint-disable-next-line no-shadow
		const index = await data.applications.findIndex((array) => {
			return array.name === name;
		});
		data.applications.splice(index, 1);
		data.save();
		return true;
	}
	static async getDropdownComponent({ guildID }) {
		if (!guildID) throw new Error('NuggiesError: GuildID not provided');
		const options = [];
		const data = await schema.findOne({ guildID: guildID });
		if (!data || !data.applications[0]) return null;
		data.applications.forEach(app => {
			const menu = {
				label: app.name,
				value: app.name,
				description: `apply for ${app.name}`,
			};
			if (app.emoji != 'null') {
				menu.emoji = app.emoji;
			}
			options.push(menu);
		});
		const dropdown = new MessageSelectMenu().addOptions(options).setCustomId('app');
		return dropdown
			? dropdown
			: null;
	}
	static async create({ guildID, content, client }) {
		if (!guildID) throw new Error('NuggiesError: GuildID not provided');
		if (!content) throw new Error('NuggiesError: content not provided');

		const data = await this.getDataByGuild(guildID);
		// if (!data) throw new Error('NuggiesError: Data not found in database');
		if (!data.channelID || data.channelID == 'null') throw new Error('channelID not present in the data.');
		content instanceof MessageEmbed
			? client.channels.cache.get(data.channelID).send({ embeds: [content], components: [new MessageActionRow().addComponents(await this.getDropdownComponent({ guildID }))] })
			: client.channels.cache.get(data.channelID).send({ content, components: [new MessageActionRow().addComponents(await this.getDropdownComponent({ guildID }))] });
	}

	/**
	 * @param {String} guildID
	 * @returns {Document}
	 */
	static async getDataByGuild(guildID) {
		const data = await schema.findOne({ guildID: guildID });
		return data;
	}

	// /**
	//  * @param {String} userID - User's ID
	//  * @param {String} guildID - Guild's ID
	//  * @param {Number} max - Amount of responses to return, default 1
	//  * @returns {undefined|Object[]} - Returns undefined if no data found
	//  */
	// static async getResponses(userID, guildID, max = 1) {
	// 	const data = await this.getDataByGuild(guildID);
	// 	if (!data) return;
	// 	const responses = data.responses.filter(x => x.userID == userID);
	// 	if (!responses) return;
	// 	return responses.sort((a, b) => b.createdAt - a.createdAt).slice(0, max);
	// }

	// /**
	//  * @param {String} userID
	//  * @param {String} guildID
	//  * @param {Number} max
	//  * @returns {undefined|Document} Returns undefined if no data found
	//  */
	// static async deleteResponses(userID, guildID, max = 1) {
	// 	const data = await this.getDataByGuild(guildID);
	// 	if (!data) return;
	// 	const responses = data.responses.filter(x => x.userID == userID);
	// 	if (!responses) return;
	// 	let count = 0;
	// 	data.reponses = data.responses.sort((a, b) => b.createdAt - a.createdAt).filter(x => (x.userID !== userID) && (!count > max) && (typeof count++ == 'number'));
	// 	data.save();
	// 	return data;
	// }

	// /**
	//  * @param {Document} data
	//  * @param {String} userID
	//  * @returns {Document}
	//  */
	// static async acceptResponse(message, data, userID) {
	// 	const res = data.responses.find(x => x.userID == userID);
	// 	res.accepted = true;
	// 	await data.save();
	// 	message.client.users.cache.get(userID).send('congratulations! your application has been accepted!');
	// 	return data;
	// }

	// /**
	//  * @param {Document} data
	//  * @param {String} userID
	//  * @param {Boolean} del
	//  * @returns {Document}
	//  */
	// static async declineResponse(message, data, userID, del = false) {
	// 	const res = data.responses.find(x => x.userID == userID);
	// 	res.accepted = false;
	// 	message.client.users.cache.get(userID).send('unfortunately your application was denied!');
	// 	await data.save();
	// 	if (del) this.deleteResponses(userID, data.guildID);
	// 	return data;
	// }
	/**
	 *
	 * @param {Discord.Message} message - The discord message
	 */
	static async setup(message) {
		if (!message) throw new Error('NuggiesError: message not provided');
		const application = {
			guildID: message.guild.id,
			questions: [],
		};
		message.channel.send('What should be the name of the application?');
		const filter = m => m.author.id === (message.author?.id || message.user?.id);
		const collector = message.channel.createMessageCollector({ filter });
		let step = 0;
		collector.on('collect', async (msg) => {
			if (!msg.content) return msg.reply('That is not valid option!');
			step++;
			if (step == 1) {
				application.name = msg.content;
				message.channel.send('What should be the description of the application?');
			}
			else if (step == 2) {
				application.description = msg.content;
				message.channel.send('Where should be the responses sent in? Provide the ID of the channel');
			}
			else if (step == 3) {
				if (!message.guild.channels.cache.get(msg.content)) return collector.stop('INVALID_CHANNEL');
				application.responseChannelID = msg.content;
				message.channel.send('Where should the message be sent? Provide the ID of the channel');
			}
			else if (step == 4) {
				if (!message.guild.channels.cache.get(msg.content)) return collector.stop('INVALID_CHANNEL');
				application.channel = msg.content;
				message.channel.send('What should be the emoji? Optional');
			}
			else if (step == 5) {
				const reaction = await msg.react(msg.content).catch(() => null);
				if (reaction) application.emoji = reaction.emoji.id ? reaction.emoji.id : reaction.emoji.name;
				message.channel.send('What should be the label?');
			}
			else if (step == 6) {
				application.label = msg.content;
				message.channel.send('How many max applications should 1 person be able to create?');
			}
			else if (step == 7) {
				if (isNaN(msg.content)) return collector.stop('INVALID_NUMBER');
				application.maxApps = parseInt(msg.content);
				message.channel.send('What questions do you want in the application? Say `done` when you have put all the questions');
			}
			else if (step >= 8) {
				if (msg.content.toLowerCase() == 'done') {
					await this.addApplication(application);
					message.channel.send('application added!');
					collector.stop('DONE');
					return setTimeout(() => this.create({ guildID: message.guild.id, content: 'choose from the dropdown menu to apply!', client: message.client }), 2000);
				}
				application.questions.push(msg.content);
				message.channel.send(`What is question #${application.questions.length + 1}?`);
			}
		});

		collector.on('end', async (msg, reason) => {
			if (reason == 'INVALID_CHANNEL') return message.channel.send('channel ID is invalid');
			if (reason == 'INVALID_NUMBER') return message.channel.send('number is invalid');
		});
	}
}

module.exports = Applications;