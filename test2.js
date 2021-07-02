const Nuggies = require('./index.js');
const Discord = require('discord.js');
const client = new Discord.Client();
require('discord-buttons')(client);
client.on('ready', () => console.log('erady'));

client.on('clickButton', button => {
	Nuggies.giveaways.buttonclick(client, button);
});
client.on('message', message => {
	if(message.content === '!test') {
		const a = new Nuggies.dropdownroles().addrole({ label: 'horny', emoji: '779705556600356896', role: '824999332885037109' });
		Nuggies.dropdownroles.create({ message: message, content: 'haha xd', role: a, channelID: message.channel.id });
	}
});

client.on('clickMenu', async (menu) => {
	console.log(menu);
});

client.login('ODM1NzU5MTExMTIzMTA3OTAz.YIUHUw.2-VtZaxVdavwmdGxvNxjqvxaO8Q');