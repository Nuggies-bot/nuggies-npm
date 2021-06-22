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

	static async create({ message, embed, role }) {
		const buttons = [];
		const rows = [];
		// Promise.resolve(role).then(console.log);
		for (const buttonObject of role.roles) {
			buttons.push(new MessageButton().setStyle(buttonObject.color).setEmoji(buttonObject.emoji).setLabel(buttonObject.label).setID(`br-${buttonObject.role}`));
		}
		for (let i = 0; i < Math.ceil(role.roles.length / 5); i++) {
			rows.push(new MessageActionRow());
		}
		rows.forEach((row, i) => {
			row.addComponents(buttons.slice(0 + (i * 5), 5 + (i * 5)));
		});
		message.channel.send({ embed: embed, components: rows });
	}
}


module.exports = buttonroles;