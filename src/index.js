const Discord = require('discord.js');

if (Discord.version.startsWith('13')) {
	const v13 = require('./classes/v13/main');
	module.exports = {
		connect: v13.connect,
		handleInteractions: v13.handleInteractions,
		Messages: v13.Messages,
		giveaways: require('./classes/v13/giveaways'),
		buttonroles: require('./classes/v13/buttonroles'),
		dropdownroles: require('./classes/v13/dropdownroles'),
		applications: require('./classes/v13/applications'),
	};
}
else if (Discord.version.startsWith('12')) {
	const v12 = require('./classes/v12/main');
	module.exports = {
		connect: v12.connect,
		handleInteractions: v12.handleInteractions,
		Messages: v12.Messages,
		giveaways: require('./classes/v12/giveaways'),
		buttonroles: require('./classes/v12/buttonroles'),
		dropdownroles: require('./classes/v12/dropdownroles'),
		applications: require('./classes/v12/applications'),
	};
}
else {
	throw new Error('Discord.js version should be v12 or more');
}