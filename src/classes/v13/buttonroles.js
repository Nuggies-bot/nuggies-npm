/* eslint-disable no-unused-vars */
const { MessageEmbed, Message, MessageButton, MessageActionRow } = require('discord.js');
const utils = require('../../functions/utils');

class ButtonRoles {

	constructor() {
		this.roles = [];
		return this;
	}

	// /**
	//  *
	//  * @param {Client} client
	//  * @param {Object} options
	//  */
	// async Messages(client, options) {
	// 	this.client = client;
	// 	client.customMessages.buttonroleMessages = merge(defaultManagerOptions, options);
	// }

	/**
	 *
	 * @param {String} color - Button Color [optional]
	 * @param {String} label - Button label
	 * @param {String} emoji - The emoji id [optional]
	 * @param {String} role - The role id
	 */
	addrole({ color, label, emoji, role }) {
		if (!color) color = 'grey';
		if (!label) throw new Error('Provide the button label!');
		if (!emoji) emoji = null;
		if (!role) throw new Error('Provide a role!');
		this.roles.push({ color: color, label: label, emoji: emoji, role: role });
		return this;
	}
	toJSON() { return { roles: this.roles }; }

	/**
	 * @param {Message} message - The Discord Message
	 * @param {MessageEmbed} embed - The Discord Embed/Content
	 * @param {buttonroles} role - The created object using .buttonroles().addrole()
	 * @param {String} channelID - the id of the channel you want to send the message to.
	 * @returns {Message} - The message sent
	 */
	static async create(client, { content, role, channelID }) {
		if (!client) throw new TypeError('Provide the Discord Client');
		if (!content) throw new Error('Provide content!');
		if (!(content instanceof MessageEmbed) || !typeof content == 'string') throw Error('Provide valid content');
		if (!role) throw new Error('Role not provided!');
		if (!(role instanceof ButtonRoles)) throw Error('Provide valid roles');
		if (!channelID) throw new Error('channelID not provided!');
		if (typeof channelID !== 'string') throw TypeError('Provide a valid channel ID');
		if (!channelID.match(/[0-9]{18}/) || channelID.length !== 18) throw TypeError('Provide a valid channel ID');
		const buttons = [];
		const rows = [];
		// Promise.resolve(role).then(console.log);
		// console.log(role);
		for (const buttonObject of role.roles) {
			const button = new MessageButton()
				.setStyle(utils.isDjsButtonStyle(buttonObject.color) ? buttonObject.color : utils.convertButtonStyle(buttonObject.color))
				.setLabel(buttonObject.label)
				.setCustomId(`br:${buttonObject.role}`);
			buttonObject.emoji
				? button.setEmoji(buttonObject.emoji)
				: null;
			buttons.push(button);
		}
		for (let i = 0; i < Math.ceil(role.roles.length / 5); i++) {
			rows.push(new MessageActionRow());
		}
		rows.forEach((row, i) => {
			row.addComponents(buttons.slice(0 + (i * 5), 5 + (i * 5)));
		});
		return await (content instanceof MessageEmbed
			? client.channels.cache.get(channelID).send({ embeds: [content], components: rows })
			: client.channels.cache.get(channelID).send({ content, components: rows }));
	}

	/**
	 * @param {Message} message - The Discord Message
	 * @param {MessageEmbed} embed - The Discord Embed/Content
	 * @param {buttonroles} role - The created object using .buttonroles().addrole()
	 * @returns {Message} - The message edited
	 */
	static async edit({ message, content, role }) {
		if (!message) throw new TypeError('Provide the Discord Message');
		if (!(message instanceof Message)) throw Error('Provide a valid message');
		if (!content) throw new Error('Provide content for the message!');
		if (!(content instanceof MessageEmbed) || !typeof content == 'string') throw Error('Provide valid content');
		if (!role) throw new Error('Role not provided!');
		if (!(role instanceof ButtonRoles)) throw Error('Provide valid roles');
		const buttons = [];
		const rows = [];
		// Promise.resolve(role).then(console.log);
		// console.log(role);
		for (const buttonObject of role.roles) {
			const button = new MessageButton()
				.setStyle(buttonObject.color)
				.setLabel(buttonObject.label)
				.setCustomId(`br:${buttonObject.role}`);
			buttonObject.emoji
				? button.setEmoji(buttonObject.emoji)
				: null;
			buttons.push(button);
		}
		for (let i = 0; i < Math.ceil(role.roles.length / 5); i++) {
			rows.push(new MessageActionRow());
		}
		rows.forEach((row, i) => {
			row.addComponents(buttons.slice(0 + (i * 5), 5 + (i * 5)));
		});
		return await (content instanceof MessageEmbed
			? message.edit({ embeds: [content], components: rows })
			: message.edit({ content: content, components: rows }));
	}

	/**
	 * @param {Message} message - The buttonroles message sent by bot
	 */
	static delete(message) {
		if (!message) throw Error('Provide a message');
		if (!(message instanceof Message)) throw Error('Provide a valid message');
		if (message.deleted) throw Error('The buttonrole is already deleted');
		if (!message.deletable) throw Error('Unable to delete the message');
		message.delete().catch((e) => { throw Error(e); });
	}
}

module.exports = ButtonRoles;