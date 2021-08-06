const { MessageActionRow, MessageMenuOption, MessageMenu } = require('discord-buttons');
const { MessageEmbed, Client } = require('discord.js');
const defaultManagerOptions = {
	addMessage: 'I have added the <@&{role}> role to you!',
	removeMessage: 'I have removed the <@&{role}> role from you!',
};
const merge = require('deepmerge');
class dropdownroles {
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
	// 	client.customMessages.dropdownrolesMessages = merge(defaultManagerOptions, options);
	// }
	/**
	 *
	 * @param {String} label - dropdown label
	 * @param {String} emoji - The emoji id [optional]
	 * @param {String} role - The role id
	 */
	addrole({ label, emoji, role }) {
		if (!label) throw new Error('please provide the dropdown label!');
		if (!emoji) emoji = null;
		if (!role) throw new Error('please provide a role!');
		this.roles.push({ label: label, emoji: emoji, role: role });
		return this;
	}
	toJSON() { return { roles: this.roles }; }

	/**
 *
 * @param {Message} message - The Discord Message
 * @param {String} content - The Discord send data, can be an embed or string
 * @param {String} role - The role ID of the role
 * @param {String} channelID - The channel ID that will be recieving the dropdown
 */
	static async create({ message, content, role, channelID }) {
		// if(!message.client.customMessages || !message.client.customMessages.dropdownrolesMessages) message.client.customMessages.dropdownrolesMessages = defaultManagerOptions;
		if(!message) throw new TypeError('please provide the Discord Message');
		if(!content) throw new Error('please provide content!');
		if(!role) throw new Error('role not provided!');
		if(!channelID) throw new Error('channelID not provided!');
		const dropdownsOptions = [];
		// Promise.resolve(role).then(console.log);
		// console.log(role);
		for (const buttonObject of role.roles) {
			dropdownsOptions.push(new MessageMenuOption().setEmoji(buttonObject.emoji).setLabel(buttonObject.label).setValue(buttonObject.role).setDescription(`click this to get the ${message.guild.roles.cache.get(buttonObject.role).name} role!`.substr(0, 50)));
		}

		const dropdown = new MessageMenu().setID('dr');
		dropdown.options = dropdownsOptions;
		// console.log(dropdown);
		const row = new MessageActionRow().addComponent(dropdown);
		content instanceof MessageEmbed ? message.client.channels.cache.get(channelID).send({ embed: content, components: [row] }) : message.client.channels.cache.get(channelID).send(content, { components: [row] });
	}
}


module.exports = dropdownroles;