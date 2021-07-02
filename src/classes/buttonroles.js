const { MessageButton, MessageActionRow } = require('discord-buttons');
const { MessageEmbed, Message } = require('discord.js');
class buttonroles {

	constructor() {
		this.roles = [];
		return this;
	}

	/**
	 *
	 * @param {String} color - Button Color [optional]
	 * @param {String} label - Button label
	 * @param {String} emoji - The emoji id [optional]
	 * @param {String} role - The role id
	 */
	addrole({ color, label, emoji, role }) {
		if (!color) color = 'gray';
		if (!label) throw new Error('please provide the button label!');
		if (!emoji) emoji = null;
		if (!role) throw new Error('please provide a role!');
		this.roles.push({ color: color, label: label, emoji: emoji, role: role });
		return this;
	}
	toJSON() { return { roles: this.roles }; }

	/**
	 * @param {Message} message - The Discord Message
	 * @param {MessageEmbed} embed - The Discord Embed
	 * @param {buttonroles} role - The created object using .buttonroles().addrole()
	 * @param {String} channelID - the id of the channel you want to send the message to.
	 */
	static async create({ message, content, role, channelID }) {
		if((message instanceof Message) == false) throw new TypeError('please provide the Discord Message');
		if(!content) throw new Error('please provide content!');
		if(!role) throw new Error('role not provided!');
		if(!channelID) throw new Error('channelID not provided!');
		const buttons = [];
		const rows = [];
		// Promise.resolve(role).then(console.log);
		// console.log(role);
		for (const buttonObject of role.roles) {
			buttons.push(new MessageButton().setStyle(buttonObject.color).setEmoji(buttonObject.emoji).setLabel(buttonObject.label).setID(`br:${buttonObject.role}`));
		}
		for (let i = 0; i < Math.ceil(role.roles.length / 5); i++) {
			rows.push(new MessageActionRow());
		}
		rows.forEach((row, i) => {
			row.addComponents(buttons.slice(0 + (i * 5), 5 + (i * 5)));
		});
		content instanceof MessageEmbed ? message.client.channels.cache.get(channelID).send({ embed: content, components: rows }) : message.client.channels.cache.get(channelID).send(content, { components: rows });
	}
}


module.exports = buttonroles;