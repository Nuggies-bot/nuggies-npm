/* eslint-disable no-inline-comments */
/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const handleButtons = require('./functions/handleButtons');
const handleMenus = require('./functions/handleMenus');
const merge = require('deepmerge');

const defaultGiveawayMessages = {
	dmWinner: true,
	giveaway: '🎉🎉 **GIVEAWAY!** 🎉🎉',
	giveawayDescription: '🎁 Prize: **{prize}**\n🎊 Hosted by: {hostedBy}\n⏲️ Winner(s): `{winners}` \n 👨‍🦱 participants: {totalParticipants} \n\n**Requirements:** {requirements}',
	endedGiveawayDescription : '🎁 Prize: **{prize}**\n🎊 Hosted by: {hostedBy}\n⏲️ Winner(s): {winners} \n 👨‍🦱 participants: {totalParticipants}',
	giveawayFooterImage: 'https://cdn.discordapp.com/emojis/843076397345144863.png',
	winMessage: 'congrats {winners}! you won `{prize}`!! Total `{totalParticipants}` members participated and your winning percentage was `{winPercentage}%`',
	rerolledMessage: 'Rerolled! {winner} is the new winner of the giveaway!', // only {winner} placeholder
	toParticipate: '**Click the Enter button to enter the giveaway!**',
	newParticipant: 'You have successfully entered for this giveaway! your win percentage is `{winPercentage}%` among `{totalParticipants}` other participants', // no placeholders | ephemeral
	alreadyParticipated: 'you already entered this giveaway!', // no placeholders | ephemeral
	noParticipants: 'There are not enough people in the giveaway!', // no placeholders
	noRole: 'You do not have the required role(s)\n{requiredRoles}\n for the giveaway!', // only {requiredRoles} | ephemeral
	dmMessage: 'You have won a giveaway in **{guildName}**!\nPrize: [{prize}]({giveawayURL})',
	noWinner: 'Not enough people participated in this giveaway.', // no {winner} placerholder
	alreadyEnded: 'The giveaway has already ended!', // no {winner} placeholder
	dropWin: '{winner} Won The Drop!!',
	noWeeklyExp: 'you dont have the required minimum weekly xp to join this giveaway',
	noLevel: 'You dont have the minimum required level to join this giveaway',
	nonoRole: 'You do not have the {requiredRoles} role(s) which is required to join this giveaway',
	editParticipants: true,
};
const defaultButtonRolesMessages = {
	addMessage: 'I have added the {role} role to you!',
	removeMessage: 'I have removed the {role} role from you!',
};
const defaultDropdownRolesMessages = {
	addMessage: 'I have added the {role} role to you!',
	removeMessage: 'I have removed the {role} role from you!',
};
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
	async Messages(client, {
		giveawayOptions = {}, buttonRolesOptions = {}, dropdownRolesOptions = {},
	}) {
		if (!client) throw new TypeError('NuggiesError: You didn\'t provide a Client in Messages Function.');
		if (typeof giveawayOptions !== 'object') throw new TypeError('NuggiesError: giveawaysOptions in Messages function is not an object.');
		if (typeof buttonRolesOptions !== 'object') throw new TypeError('NuggiesError: buttonRolesOptions in Messages function is not an object.');
		if (typeof dropdownRolesOptions !== 'object') throw new TypeError('NuggiesError: dropdownRolesOptions in Messages function is not an object.');
		client.customMessages = {
			giveawayMessages: merge(defaultGiveawayMessages, giveawayOptions),
			buttonRolesMessages: merge(defaultButtonRolesMessages, buttonRolesOptions),
			dropdownRolesMessages: merge(defaultDropdownRolesMessages, dropdownRolesOptions),
		};
	},
	async handleInteractions(client) {
		if (!client) throw new Error('NuggiesError: client not provided');
		client.on('interactionCreate', (interaction) => {
			if (interaction.isButton()) return handleButtons(client, interaction);
			if (interaction.isSelectMenu()) return handleMenus(client, interaction);
		});
	},
};
