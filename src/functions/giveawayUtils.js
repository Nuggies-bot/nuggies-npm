const schema = require('../models/giveawayschema');
const Discord = require('discord.js');
const ms = require('ms');
let buttons;
if (Discord.version.startsWith('12')) {
	buttons = require('discord-buttons');
}

module.exports.getButtons = (host) => {
	const reroll = new (buttons ? buttons : Discord).MessageButton()
		.setLabel('Reroll')
		.setStyle(buttons ? 'grey' : 'SECONDARY')[buttons ? 'setID' : 'setCustomId'](`giveaways-reroll-${host}`)
		.setDisabled(true);

	const end = new (buttons ? buttons : Discord).MessageButton()
		.setLabel('End')
		.setStyle(buttons ? 'red' : 'DANGER')[buttons ? 'setID' : 'setCustomId'](`giveaways-end-${host}`);

	const enter = new (buttons ? buttons : Discord).MessageButton()
		.setLabel('Enter')
		.setStyle(buttons ? 'green' : 'SUCCESS')[buttons ? 'setID' : 'setCustomId'](`giveaways-enter-${host}`);

	const b = [end, enter, reroll];
	return b;
};

module.exports.choose = async (winners, msgid) => {
	const data = await this.getByMessageID(msgid);
	if(winners > data.clickers.length + 1) return null;
	const final = [];
	// if (data.requirements.enabled == true) clickers = clickers.filter(x => this.checkRoles(x.id, data.requirements.roles, message));
	for (let i = 0; i < winners; i++) {
		if (!data.clickers[0]) return final[0] ? final : null;
		const win = data.clickers[Math.floor(Math.random() * data.clickers.length)];
		if(final.includes(win)) return i - 1;
		if (!win) return final[0] ? final : null;
		final.push(win);
	}
	return final[0] ? final : null;
};

module.exports.checkRole = (userID, roleIDs, message) => {
	let res;
	roleIDs.forEach((roleID) => {
		const role = message.guild.roles.cache.get(roleID);
		if (!message.guild.members.cache.get(userID).roles.cache.get(role.id)) res = false;
	});
	if (res == false) return res;
	res = true;
	return res;
};

module.exports.editButtons = async (client, data) => {
	const m = await client.guilds.cache.get(data.guildID).channels.cache.get(data.channelID).messages.fetch(data.messageID);
	const bs = await this.getButtons(data.host);
	bs.find(x => x.label == 'End').setDisabled().setStyle(buttons ? 'grey' : 'SECONDARY');
	bs.find(x => x.label == 'Enter').setDisabled().setStyle(buttons ? 'grey' : 'SECONDARY');
	bs.find(x => x.label == 'Reroll').setDisabled(false).setStyle(buttons ? 'green' : 'SUCCESS');
	const row = new (buttons ? buttons : Discord).MessageActionRow().addComponents(bs);
	m.edit({ components: [row], embed: buttons ? m.embeds[0] : undefined, embeds: buttons ? undefined : m.embeds }).catch((e) => { console.log('e' + e); });
};

module.exports.giveawayEmbed = async (client, { host, prize, endAfter, winners, requirements }) => {
	const hostedBy = client.users.cache.get(host) || await client.users.fetch(host).catch(() => null);
	let req = '';
	if(requirements.roles) req += `\n role(s): ${requirements.roles.map(x => `<@&${x}>`).join(', ')}`;
	if(requirements.weeklyamari) req += `\n Weekly Amari: \`${requirements.weeklyamari}\``;
	if(requirements.amarilevel) req += `\n Amari Level: \`${requirements.amarilevel}\``;
	const embed = new Discord.MessageEmbed()
		.setTitle('Giveaway! 🎉')
		.setDescription(`${client.customMessages.giveawayMessages.toParticipate}\n${(client.customMessages.giveawayMessages.giveawayDescription).replace(/{requirements}/g, req).replace(/{hostedBy}/g, hostedBy).replace(/{prize}/g, prize).replace(/{winners}/g, winners).replace(/{totalParticipants}/g, '0')}`)
		.setColor('RANDOM')
		.setFooter('Ends', client.customMessages.giveawayMessages.giveawayFooterImage)
		.setTimestamp(Date.now() + ms(endAfter));
	return embed;
};
module.exports.dropEmbed = async (client, { prize, host }) => {
	const hoster = client.users.cache.get(host) || await client.users.fetch(host).catch();
	const embed = new Discord.MessageEmbed()
		.setTitle('Giveaway Drop! 🎉')
		.setDescription(`**first to click the button wins!**\n🎁 Prize: **${prize}**\n🎊 Hosted by: ${hoster}\n`)
		.setColor('RANDOM')
		.setFooter('winner: none');
	return embed;
};
module.exports.getByMessageID = async (messageID) => {
	const doc = await schema.findOne({ messageID: messageID });

	if (!doc) return;
	return doc;
};

module.exports.editDropButtons = async (client, button) => {
	const m = await client.guilds.cache.get(button.guild.id).channels.cache.get(button.channel.id).messages.fetch(button.message.id);
	const bs = await this._dropButtons('xd');
	bs.setDisabled().setStyle(buttons ? 'grey' : 'SECONDARY');
	const row = new (buttons ? buttons : Discord).MessageActionRow().addComponents([bs]);
	const embed = m.embeds[0];
	embed.footer.text = `drop ended! ${button.clicker ? button.clicker.user.tag : button.user.tag} won!`;

	m.edit({ components: [row], embed: buttons ? embed : undefined, embeds: buttons ? undefined : [embed] }).catch((e) => { console.log('e' + e); });
};

module.exports.dropButtons = async (prize) => {
	const enter = new (buttons ? buttons : Discord).MessageButton()
		.setLabel('Enter')
		.setStyle(buttons ? 'green' : 'SUCCESS')[buttons ? 'setID' : 'setCustomId'](`giveaways-drop-${prize}`);
	const b = new (buttons ? buttons : Discord).MessageActionRow().addComponents([enter]);
	return b;
};

module.exports._dropButtons = async () => {
	const enter = new (buttons ? buttons : Discord).MessageButton()
		.setLabel('Enter')
		.setStyle('green')[buttons ? 'setID' : 'setCustomId']('giveaways-drop');
	return enter;
};
