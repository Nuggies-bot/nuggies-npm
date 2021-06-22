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
		if(!color) color = 'gray';
		if(!label) throw new Error('please provide the button label!');
		if(!emoji) emoji = null;
		if(!role) throw new Error('please provide a role!');
		this.roles.push({ color: color, label: label, emoji: emoji, role: role });
		return this;
	}
	toJSON() { return { roles: this.roles };}

	static async create({ message, embed, role }) {
		const buttons = [];
		const rows = [];
		let final;
		// Promise.resolve(role).then(console.log);
		for(const buttonObject of role.roles) {
			buttons.push(new MessageButton().setStyle(buttonObject.color).setEmoji(buttonObject.emoji).setLabel(buttonObject.label).setID(`br-${buttonObject.role}`));
		}
		buttons.map(x => {
			final = rows.reverse()[0].components.length == 5 ? rows.push(new MessageActionRow().addComponent(x)) : !rows.reverse()[0] ? rows.push(new MessageActionRow().addComponent(x)) : rows.reverse()[0].addComponent(x);
		});
		message.channel.send({ embed: embed, compoonents: final });
	}
}


module.exports = buttonroles;