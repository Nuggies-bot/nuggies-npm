/* eslint-disable no-unused-vars */
// Make sure you use `npm run test` when testing the package!

require('dotenv').config();
const Nuggies = require('./src/index.js');
const Discord = require('discord.js');
const bot = new Discord.Client({ intents: 32767 });
// require('discord-buttons')(bot);
bot.login(process.env.token);

Nuggies.handleInteractions(bot);
Nuggies.connect(process.env.mongo);
bot.on('messageCreate', async (message) => {
	if (message.author.bot || message.channel.type === 'dm') return;

	const prefix = '...';
	if (!message.content.startsWith(prefix)) return;
	// Args system
	const messageArray = message.content.split(' ');
	const cmd = messageArray[0].slice(prefix.length);
	const args = messageArray.slice(1);

	if (!cmd) return;

	if (cmd.toLowerCase() === '.applications') {
		Nuggies.applications.setup(message);
	}
	else if (cmd.toLowerCase() == 'test') {
		Nuggies.applications.setup(message);
	}
	else if (cmd.toLowerCase() == 'die') {
		await message.channel.send('ok');
		process.exit();
	}
});

bot.on('ready', () => console.log('i am online hahahahahahaha'));