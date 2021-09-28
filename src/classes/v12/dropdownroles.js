const { MessageActionRow, MessageMenuOption, MessageMenu } = require('discord-buttons');
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
	static async create(client, { content, role, channelID, type, min, max }) {
		if (!client) throw new TypeError('Provide the Discord Client');
		if(!content) throw new Error('please provide content!');
		if(!role) throw new Error('role not provided!');
		if(!channelID) throw new Error('channel ID not provided!');
		if(!type) throw new Error('type was not provided');
		const dropdownsOptions = [];
		const roles = [];
		// Promise.resolve(role).then(console.log);
		// console.log(role);
		for (const buttonObject of role.roles) {
			dropdownsOptions.push(new MessageMenuOption().setEmoji(buttonObject.emoji).setLabel(buttonObject.label).setValue(buttonObject.role).setDescription(`click this to get the ${client.channels.cache.get(channelID).guild.roles.cache.get(buttonObject.role).name} role!`.substr(0, 50)));
			roles.push(buttonObject.role);
		}
		const dropdown = new MessageMenu();

		if (type.toLowerCase() === 'multiple') {
			if(!min || !max) throw new Error('For type MULTIPLE you need to provide min & max amount of roles that can be selected at once');
			if(isNaN(min) || isNaN(max)) throw new Error('min/max amount should be a valid number');
			dropdown.setMinValues(parseInt(min)).setMaxValues(parseInt(max));
		}
		else if (!['single', 'multiple'].includes(type.toLowerCase())) {
			throw new Error('Provide a valid dropdown type');
		}

		dropdown.id = 'dr-' + type.toLowerCase();

		dropdown.options = dropdownsOptions;
		const row = new MessageActionRow().addComponents([dropdown]);
		if (typeof content === 'object') {
			client.channels.cache.get(channelID).send({ embed: content, components: [row] });
		}
		else {
			client.channels.cache.get(channelID).send(content, { components: [row] });
		}
	}
}

module.exports = dropdownroles;