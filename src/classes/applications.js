const { MessageActionRow, MessageMenu, MessageMenuOption } = require('discord-buttons');
const schema = require('../models/applictionsschema');

class applications {
	/**
     *
     * @param {Array} questions - Questions array
     * @param {String} name - the application name
     * @param {String} emoji - the dropdown emoji ID or unicode
     * @param {String} channel - the channel ID of the channel which will recieve the answers
     * @param {String} description - the description of the dropdown
     * @param {String} label - The dropdown label
     */
	static async create({ guildID, questions, name, emoji, channel, description, label }) {
		if(!guildID) throw new Error('NuggiesError: guildID not provided');
		if(!questions) throw new Error('NuggiesError: questions Array not provided');
		if(!name) throw new Error('NuggiesError: name not provided');
		if(!emoji) throw new Error('NuggiesError: emoji not provided');
		if(!channel) throw new Error('NuggiesError: channel ID not provided');
		if(!description) throw new Error('NuggiesError: description not provided');
		if(!label) throw new Error('NuggiesError: label not provided');
		if(typeof guildID !== 'string') throw new Error('NuggiesError: guildID must be a string');
		// if(!questions.isArray) throw new Error('NuggiesError: questions must be an array');
		if(typeof name !== 'string') throw new Error('NuggiesError: name must be a string');
		if(typeof emoji !== 'string') throw new Error('NuggiesError: emoji must be a string');
		if(typeof channel !== 'string') throw new Error('NuggiesError: channel must be a string');
		if(typeof description !== 'string') throw new Error('NuggiesError: description must be a string');
		if(typeof label !== 'string') throw new Error('NuggiesError: label must be a string');

		const object = {
			name: name,
			questions: questions,
			description: description,
			label: label,
			emoji: emoji,
		};
		let data = await schema.findOne({ guildID: guildID });
		if(!data) {
			data = new schema({
				guildID: guildID,
				applications: [object],
			});
		}
		if(data) {
			data.applications.push(object);
		}
		data.save();
		return data;
	}
	static async deleteapplication({ guildID, name }) {
		const data = await schema.findOne({ guildID: guildID });
		if(!data) return false;
		if(data) {
			const index = await data.applications.findIndex(function(array, index) {
				return array.name === name;
			});
			data.applications.splice(index, 1);
			data.save();
			return true;
		}
	}
	static async getDropdownComponent({ guildID }) {
		if(!guildID) throw new Error('NuggiesError: GuildID not provided');
		const data = schema.findOne({ guildID: guildID });
		if(data.applications);
	}
}

module.exports = applications;