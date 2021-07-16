const { MessageMenu, MessageMenuOption } = require('discord-buttons');
const { MessageEmbed } = require('discord.js');
const schema = require('../models/applictionsschema');
const ms = require('ms');

class applications {
	/**
	 *
	 * @param {Array} questions - Questions array
	 * @param {String} name - the application name
	 * @param {String} emoji - the dropdown emoji ID or unicode
	 * @param {String} channel - the channel ID of the channel which will recieve the answers
	 * @param {String} description - the description of the dropdown
	 * @param {String} label - The dropdown label
	 * @param {Number} maxApps - The amount of responses
	 */
	static async addApplication({ guildID, questions, name, emoji, channel, description, label, maxApps, cooldown }) {
		if (!guildID) throw new Error('NuggiesError: guildID not provided');
		if (!questions) throw new Error('NuggiesError: questions Array not provided');
		if (!name) throw new Error('NuggiesError: name not provided');
		if (!emoji) throw new Error('NuggiesError: emoji not provided');
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

		if (cooldown) cooldown = ms(cooldown);

		const object = {
			name: name,
			questions: questions,
			description: description,
			label: label,
			emoji: emoji,
		};
		let data = await schema.findOne({ guildID: guildID });
		if (!data) {
			data = new schema({
				guildID: guildID,
				channelID: channel,
				applications: [object],
				maxApplicationsFromUser: maxApps,
				applicationCooldown: cooldown,
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
	static async deleteapplication({ guildID, name }) {
		const data = await schema.findOne({ guildID: guildID });
		if (!data) return false;
		if (data) {
			// eslint-disable-next-line no-shadow
			const index = await data.applications.findIndex((array) => {
				return array.name === name;
			});
			data.applications.splice(index, 1);
			data.save();
			return true;
		}
	}
	static async getDropdownComponent({ guildID }) {
		if (!guildID) throw new Error('NuggiesError: GuildID not provided');
		const options = [];
		const data = await schema.findOne({ guildID: guildID });
		if (!data || !data.applications[0]) return null;
		data.applications.forEach(app => {
			const menu = new MessageMenuOption()
				.setLabel(app.name)
				.setValue(app.name)
				.setDescription(`apply for ${app.name}`);
			if (app.emoji !== 'null') {
				menu.setEmoji(app.emoji);
			}
			options.push(menu);
		});
		const dropdown = new MessageMenu().addOptions(options).setID('app');
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
			? client.channels.cache.get(data.channelID).send({ embed: content, component: await this.getDropdownComponent({ guildID }) })
			: client.channels.cache.get(data.channelID).send({ content, component: await this.getDropdownComponent({ guildID }) });
	}
	static async getDataByGuild(guildID) {
		const data = await schema.findOne({ guildID: guildID });
		return data;
	}

	/**
	 * @param {String} userID - User's ID
	 * @param {String} guildID - Guild's ID
	 * @param {Number} max - Amount of responses to return, default 1
	 * @returns {undefined|Object[]} - Returns undefined if no data found
	 */
	static async getResponses(userID, guildID, max = 1) {
		const data = await this.getDataByGuild(guildID);
		if (!data) return;
		const responses = data.responses.filter(x => x.userID == userID);
		if (!responses) return;
		return responses.sort((a, b) => b.createdAt - a.createdAt).slice(0, max);
	}

	/**
	 * @param {String} userID
	 * @param {String} guildID
	 * @param {Number} max
	 * @returns {undefined|Object[]} - Returns undefined if no data found
	 */
	static async deleteResponses(userID, guildID, max = 1) {
		const data = await this.getDataByGuild(guildID);
		if (!data) return;
		const responses = data.responses.filter(x => x.userID == userID);
		if (!responses) return;
		let count = 0;
		data.reponses = data.responses.sort((a, b) => b.createdAt - a.createdAt).filter(x => (x.userID !== userID) && (!count > max) && (typeof count++ == 'number'));
		data.save();
	}
}

module.exports = applications;