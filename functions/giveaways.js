/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const schema = require('../models/giveaways');
const { giveawayEmbed, giveawayButtons } = require('../utils/utils');
const Discord = require('discord.js');
const { MessageButton, MessageActionRow } = require('discord-buttons');

module.exports = {

	/**
	 * @param {any} - The Discord Message
	 * @param {String} - the giveaway prize
	 * @param {String} - the giveaway host
	 * @param {Number} - timestamp when the giveaway ends
	 * @param {Object} - role requirements object
	 * @param {String} - channel id of the giveaway channel
	 */

	async create({
		message, prize, hoster, winners, endAt, requirements, channel,
	}) {
		const msg = await message.guild.channels.cache.get(channel).send('', {
			component: giveawayButtons(hoster), embed: await giveawayEmbed(message.client, { hoster, prize, endAt, winners, requirements }),
		});
		await msg.react(message.client.emojis.cache.get('843076397345144863') || '🎉');
		const data = await new schema({
			messageID: msg.id,
			channelID: channel,
			guildID: msg.guild.id,
			hoster: hoster,
			winners: winners,
			prize: prize,
			startAt: Date.now(),
			endAt: endAt,
			requirements: requirements,
		}).save();
		await this.startTimer(message, data);
	},

	/**
	 * @param {Discord.Message} message
	 * @param {mongoose.Document} data
	 */

	async startTimer(message, data, instant = false) {
		const msg = await message.guild.channels.cache.get(data.channelID).messages.fetch(data.messageID);
		await msg.fetch();
		const time = instant ? 0 : (data.endAt - Date.now());
		setTimeout(async () => {
			if ((await this.getByMessageID(data.messageID)).ended) return 'ENDED';
			const reaction = await msg.reactions.cache.get('🎉') || msg.reactions.cache.get('843076397345144863');
			const reacts = await reaction.users.fetch({ limit: 100 });
			const winners = await this.choose(reacts.filter(x => !x.bot), data.winners, data, reaction);

			if (!winners) {
				message.channel.send('Not enough people participated in this giveaway.');
				data.ended = true;
				data.save();
				const embed = msg.embeds[0];
				embed.description = `🎁 Prize: **${data.prize}**\n🎊 Hosted by: <@${data.hoster.toString()}>\n⏲️ Winner(s): ${winners.map(winner => winner.toString()).join(', ')}`;
				msg.edit('', { embed: embed });
				this.editButtons(message.client, data);
				return 'NO_WINNERS';
			}

			message.channel.send(`${winners.map(winner => winner.toString()).join(', ')} you won ${data.prize} Congratulations! Hosted by ${message.guild.members.cache.get(data.hoster).toString()}`, { component: await this.gotoGiveaway(data), allowedMentions: { roles: [], users: winners.map(x => x.id), parse: [] } });
			const dmEmbed = new Discord.MessageEmbed()
				.setTitle('You won!')
				.setDescription(`You have won a giveaway in **${msg.guild.name}**!\nPrize: [${data.prize}](https://discord.com/${msg.guild.id}/${msg.channel.id}/${data.messageID})`)
				.setColor('RANDOM')
				.setFooter('GG!');
			winners.forEach((user) => {
				user.send(dmEmbed);
			});
			const embed = msg.embeds[0];
			embed.description = `🎁 Prize: **${data.prize}**\n🎊 Hosted by: <@${data.hoster.toString()}>\n⏲️ Winner(s): ${winners.map(winner => winner.toString()).join(', ')}`;
			msg.edit('', { embed: embed });
			data.ended = true;
			data.save();
			this.editButtons(message.client, data);
		}, time);
	},

	/**
	 * @param {String} guildID
	 * @returns {mongoose.Document[]}
	 */

	async getByGuildID(guildID) {
		const docs = await schema.find({ guildID: guildID });

		if (!docs[0]) return;
		return docs;
	},

	/**
	 * @param {String} messageID
	 * @returns {mongoose.Document}
	 */

	async getByMessageID(messageID) {
		const doc = await schema.findOne({ messageID: messageID });

		if (!doc) return;
		return doc;
	},

	/**
	 * @param {String} channelID
	 * @returns {mongoose.Document[]}
	 */

	async getByChannelID(channelID) {
		const docs = await schema.find({ channelID: channelID });

		if (!docs[0]) return;
		return docs;
	},

	/**
	 * @param {Discord.Client} client
	 * @param {String} messageID
	 * @returns {Discord.User[]}
	 */

	async reroll(client, messageID) {
		const data = await this.getByMessageID(messageID);
		const msg = await client.guilds.cache.get(data.guildID).channels.cache.get(data.channelID).messages.fetch(messageID);
		const reaction = await msg.reactions.cache.get('🎉') || msg.reactions.cache.get('843076397345144863');
		const reacts = await reaction.users.fetch({ limit: 100 });
		const chosen = await this.choose(reacts, 1, data, reaction);
		if (!chosen) return [];
		const dmEmbed = new Discord.MessageEmbed()
			.setTitle('You won!')
			.setDescription(`You have won a giveaway in **${msg.guild.name}**!\nPrize: [${data.prize}](https://discord.com/${msg.guild.id}/${msg.channel.id}/${messageID})`)
			.setColor('RANDOM')
			.setFooter('GG!');
		chosen.forEach((user) => {
			user.send(dmEmbed);
		});
		return chosen;
	},

	/**
	 * @param {Discord.Collection<Discord.Snowflake, Discord.User>} reactions
	 * @param {String} winners
	 * @param {mongoose.Document} data
	 * @param {Discord.MessageReaction} reaction
	 * @returns {Discord.User[]}
	 */

	/**
	 * @param {Discord.MessageReaction} reaction
	 * @param {Discord.Snowflake} userID
	 * @param {Discord.Snowflake[]} roleIDs
	 */
	checkRoles(reaction, userID, roleIDs) {
		let res;
		roleIDs.forEach((roleID) => {
			const role = reaction.message.guild.roles.cache.get(roleID);
			if (!reaction.message.guild.members.cache.get(userID).roles.cache.get(role.id)) res = false;
		});
		if (res == false) return res;
		res = true;
		return res;
	},

	/**
	 * @param {Discord.Client} client
	 * @param {String} messageID
	 * @param {Boolean} bool
	 * @param {MessageButton} button
	 * @returns {Discord.User[]}
	 */

	async end(client, messageID, bool, button) {
		const data = await this.getByMessageID(messageID);
		const msg = await client.guilds.cache.get(data.guildID).channels.cache.get(data.channelID).messages.fetch(messageID);
		const res = (await this._end(msg, data, msg));
		if (res == 'ENDED') button.reply.send('The giveaway has already ended!', { ephemeral: true });
	},

	async _end(message, data, msg) {
		if ((await this.getByMessageID(data.messageID)).ended) return 'ENDED';
		const reaction = await msg.reactions.cache.get('🎉') || msg.reactions.cache.get('843076397345144863');
		const reacts = await reaction.users.fetch({ limit: 100 });
		const winners = await this.choose(reacts.filter(x => !x.bot), data.winners, data, reaction);

		if (!winners) {
			message.channel.send('Not enough people participated in this giveaway.');
			data.ended = true;
			data.save();
			const embed = msg.embeds[0];
			embed.description = `🎁 Prize: **${data.prize}**\n🎊 Hosted by: <@${data.hoster.toString()}>\n⏲️ Winner(s): ${winners.map(winner => winner.toString()).join(', ')}`;
			msg.edit('', { embed: embed });
			this.editButtons(message.client, data);
			return 'NO_WINNERS';
		}

		message.channel.send(`${winners.map(winner => winner.toString()).join(', ')} you won ${data.prize} Congratulations! Hosted by ${message.guild.members.cache.get(data.hoster).toString()}`, { component: await this.gotoGiveaway(data), allowedMentions: { roles: [], users: winners.map(x => x.id), parse: [] } });
		const dmEmbed = new Discord.MessageEmbed()
			.setTitle('You won!')
			.setDescription(`You have won a giveaway in **${msg.guild.name}**!\nPrize: [${data.prize}](https://discord.com/${msg.guild.id}/${msg.channel.id}/${data.messageID})`)
			.setColor('RANDOM')
			.setFooter('GG!');
		winners.forEach((user) => {
			user.send(dmEmbed);
		});
		const embed = msg.embeds[0];
		embed.description = `🎁 Prize: **${data.prize}**\n🎊 Hosted by: <@${data.hoster.toString()}>\n⏲️ Winner(s): ${winners.map(winner => winner.toString()).join(', ')}`;
		msg.edit('', { embed: embed });
		data.ended = true;
		data.save();
		this.editButtons(message.client, data);
	},
	async editButtons(client, data) {
		const m = await client.guilds.cache.get(data.guildID).channels.cache.get(data.channelID).messages.fetch(data.messageID);
		const buttons = await giveawayButtons(data.hoster, true);
		buttons.find(x => x.label == 'End').setDisabled().setStyle('gray');
		buttons.find(x => x.label == 'Enter').setDisabled().setStyle('gray');
		buttons.find(x => x.label == 'Reroll').setDisabled(false).setStyle('green');
		const row = new MessageActionRow().addComponents(buttons);
		m.edit('', { components: [row], embed: m.embeds[0] }).catch((e) => { console.log('e' + e); });
	},
	async gotoGiveaway(data) {
		const link = `https://discord.com/channels/${data.guildID}/${data.channelID}/${data.messageID}`;
		const button = new MessageButton().setLabel('Giveaway').setStyle('url').setURL(link);
		return button;
	},
};
