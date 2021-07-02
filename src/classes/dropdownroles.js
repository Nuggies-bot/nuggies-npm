const { MessageActionRow, MessageMenuOption, MessageMenu } = require('discord-buttons');
const { MessageEmbed, Message } = require('discord.js');
class dropdownroles {
	constructor() {
		this.roles = [];
		return this;
	}

	/**
	 *
	 * @param {String} label - Button label
	 * @param {String} emoji - The emoji id [optional]
	 * @param {String} role - The role id
	 */
	addrole({ label, emoji, role }) {
		if (!label) throw new Error('please provide the button label!');
		if (!emoji) emoji = null;
		if (!role) throw new Error('please provide a role!');
		this.roles.push({ label: label, emoji: emoji, role: role });
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
		const dropdownsOptions = [];
		// Promise.resolve(role).then(console.log);
		// console.log(role);
		for (const buttonObject of role.roles) {
			dropdownsOptions.push(new MessageMenuOption().setEmoji(buttonObject.emoji).setLabel(buttonObject.label).setValue(buttonObject.role).setDescription(`click this to get the ${message.guild.roles.cache.get(buttonObject.role).name} role!`));
		}

		const dropdown = new MessageMenu().addOptions(dropdownsOptions).setID('dr');
		dropdown.options = dropdownsOptions;
		// console.log(dropdown);
		const row = new MessageActionRow().addComponent(dropdown);
		content instanceof MessageEmbed ? message.client.channels.cache.get(channelID).send({ embed: content, component: [row] }) : message.client.channels.cache.get(channelID).send(content, { components: [row] });
	}
}


module.exports = dropdownroles;