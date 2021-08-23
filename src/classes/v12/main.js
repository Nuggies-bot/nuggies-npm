/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const handleButtons = require('./functions/handleButtons');
const handleMenus = require('./functions/handleMenus');

module.exports = {
	/**
		*
		* @param {string} url - MongoDB connection URI.
		*/
	async connect(url) {
		if (!url) throw new TypeError('NuggiesError: You didn\'t provide a MongoDB connection string');
		return mongoose.connect(url, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
	},
	async handleInteractions(client) {
		if (!client) throw new Error('NuggiesError: client not provided');
		client.on('clickMenu', (menu) => handleMenus(client, menu));
		client.on('clickButton', (button) => handleButtons(client, button));
	},
};
