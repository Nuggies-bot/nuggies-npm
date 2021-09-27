const { MessageButton } = require('discord-buttons');
const schema = require('../models/ticketsschema');
class tickets {
	/**
	 * @param {String} message - The Discord Message
	 * @param {String} categoryID - The category ID under which the tickets will be made
	 * @param {String} channelID - Channel ID where the setupembed will be sent
	 * @param {String} bypassRoleID - the role which will be able to see the ticket channels
	 * @param {Boolean} pingRole - wheather to ping the bypass role when a new ticket is made
	 * @param {Object} setupembed - SetupEmbed that will be sent to the setup channel with the buttons
	 * @param {Object} button - button object containing name, label and style for the button
	 */
	static async setup({ message, categoryID, channelID, bypassRoleID, pingRole, setupembed, button }) {
		let data = await schema.findOne({ guildID: message.guild.id });
		if(!data) {
			data = new schema({
				guildID: message.guild.id,
				parentID: !categoryID ? 'null' : categoryID,
				bypassRoleID: !bypassRoleID ? 'null' : bypassRoleID,
				pingRole: !pingRole ? false : pingRole,
			});
		}
		if(data) {
			if(bypassRoleID) data.bypassroleID = bypassRoleID;
			if(categoryID) data.parentID = categoryID;
		}
		data.save();
		const setupButton = new MessageButton().setStyle(button.color).setLabel(button.emoji).setEmoji(button.emoji).setID('tickets-create');
		message.guild.channels.cache.get(channelID).send({ button: setupButton, embed: setupembed });
	}
}

module.exports = tickets;