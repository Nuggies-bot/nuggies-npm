const { MessageEmbed } = require('discord.js');
const { MessageButton } = require('node');
const schema = require('../models/ticketsschema');
class tickets {
	constructor(options) {
		if(!options.setupembed) throw new Error('NuggiesError: SetupEmbed not provided!');
		if(!options.ticketsEmbed) throw new Error('NuggiesError: ticketsEmbed not provided!');
		if((options.setupembed instanceof MessageEmbed) == false) throw new Error('NuggiesError: setupEmbed should be an instance of MessageEmbed');
		this.setupembed = options.setupembed;
		this.ticketsembed = options.ticketsembed;
	}
	/**
	 * @param {String} message - The Discord Message
	 * @param {String} categoryID - The category ID under which the tickets will be made
	 * @param {String} channelID - Channel ID where the setupembed will be sent
	 * @param {String} bypassRoleID - the role which will be able to see the ticket channels
	 * @param {Boolean} pingRole - wheather to ping the bypass role when a new ticket is made
	 */

	async setup({ message, categoryID, channelID, bypassRoleID, pingRole }) {
		let data = await schema.findOne({ guildID: message.guild.id });
		if(!data) {
			data = new schema({
				guildID: message.guild.id,
				parentID: !categoryID ? null : categoryID,
				bypassRoleID: !bypassRoleID ? null : bypassRoleID,
				pingRole: !pingRole ? false : pingRole,
			});
		}
		if(data) {
			if(bypassRoleID) data.bypassroleID = bypassRoleID;
			if(categoryID) data.parentID = categoryID;
		}
		const setupButton = new MessageButton().setStyle('green').setLabel('open a ticket').setEmoji('🎟️');
		message.guild.channels.cache.get(channelID).send(this.setupembed, { button: setupButton });
	}
}

module.exports = tickets;