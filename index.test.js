/* eslint-disable no-unused-vars */
const Nuggies = require('./index.js');
const Discord = require('discord.js');
const bot = new Discord.Client();
require('discord-buttons')(bot);

bot.login('totally-working-legit-token');

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
		const manager = new Nuggies.buttonroles().addrole({ color: 'red', label: 'test', role: '807978319894413352', emoji: null });
		const msg = await Nuggies.buttonroles.create({ message, content: 'test', role: manager, channelID: message.channel.id });
		manager.addrole({ color: 'grey', label: 'hi', role: '804978976904052757' });
		// setTimeout(() => Nuggies.buttonroles.edit({ color: 'grey', label: 'haha', role: '739562964871304628' }), 5000)
		setTimeout(() => Nuggies.buttonroles.delete(msg), 5000);
	}
});

bot.on('ready', () => console.log('i am online hahahahahahaha'));