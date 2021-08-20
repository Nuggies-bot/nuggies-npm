/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const handleButtons = require('./functions/handleButtons');
const handleMenus = require('./functions/handleMenus');

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
		client.on('interactionCreate', (interaction) => {
			if (interaction.isButton()) return handleButtons(client, interaction);
			if (interaction.isSelectMenu()) return handleMenus(client, interaction);
		});
	}
}
module.exports = main;


function replacePlaceholders(string, button, role) {
	const newString = string.replace(/{guildName}/g, button.message.guild.name).replace(/{clicker}/g, button.user.username).replace(/{role}/g, role);
	return newString;
}