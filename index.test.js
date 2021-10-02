/* eslint-disable no-inline-comments */
/* eslint-disable no-unused-vars */
// Make sure you use `npm run test` when testing the package!
const defaultGiveawayMessages = {
	dmWinner: true,
	giveaway: '🎉🎉 **GIVEAWAY!** 🎉🎉',
	giveawayDescription: '🎁 Prize: **{prize}**\n🎊 Hosted by: {hostedBy}\n⏲️ Winner(s): `{winners}`\n\nRequirements: {requirements}',
	endedGiveawayDescription : '🎁 Prize: **{prize}**\n🎊 Hosted by: {hostedBy}\n⏲️ Winner(s): {winners}',
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
};


require('dotenv').config();
const Nuggies = require('./src/index.js');
const Discord = require('discord.js');
const bot = new Discord.Client({ intents: 32767 });
require('discord-buttons')(bot);
bot.login(process.env.token);

Nuggies.handleInteractions(bot);
Nuggies.Messages(bot, {
	giveawayOptions: defaultGiveawayMessages,
});
Nuggies.connect(process.env.mongo);
bot.on('message', async (message) => {
	if (message.author.bot || message.channel.type === 'dm') return;

	const prefix = '...';
	if (!message.content.startsWith(prefix)) return;
	// Args system
	const messageArray = message.content.split(' ');
	const cmd = messageArray[0].slice(prefix.length);
	const args = messageArray.slice(1);

	if (!cmd) return;

	if (cmd.toLowerCase() === 'test') {
		Nuggies.giveaways.create(bot, { prize: 'test', host: '833713876628406363', winners: 1, endAfter: '10s', requirements: { enabled: true, weeklyamari: '1', amarilevel: '100', key: '8fdab047274a8010e548d56e.4595ca.d5ce77b8de6c58f2f44e5980929', roles: ['735354141941039115'] }, channelID: message.channel.id,
		});
	}
	else if (cmd.toLowerCase() == 'die') {
		await message.channel.send('ok');
		process.exit();
	}
});

bot.on('ready', () => console.log('i am online hahahahahahaha'));