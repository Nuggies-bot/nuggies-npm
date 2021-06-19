const utils = require('../utils');
const schema = require('../models/giveawayschema');
const { MessageButton } = require('discord-buttons');
const Discord = require('discord.js');
const mongoose = require('mongoose');
const ms = require('ms');
mongoose.set('useFindAndModify', false);
let connection;
let win;

class giveaways {
	/**
	*
	* @param {string} url - MongoDB connection URI.
	*/

	static async connect(url) {
		if (!url) throw new TypeError('You didn\'t provide a MongoDB connection string');

		connection = url;

		return mongoose.connect(url, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
	}
	/**
	 * @param {any} - The Discord Message
	 * @param {String} - the giveaway prize
	 * @param {String} - the giveaway host
	 * @param {Number} - timestamp when the giveaway ends
	 * @param {Object} - role requirements object
	 * @param {String} - channel id of the giveaway channel
	 */

	static async create({
		message, prize, host, winners, endAfter, requirements, channel,
	}) {
		if (!message) throw new Error('message wasnt provided while creating giveaway!');
		if (!prize) throw new Error('prize wasnt provided while creating giveaway!');
		if (typeof prize !== 'string') throw new TypeError('prize should be a string');
		if (!host) throw new Error('host wasnt provided while creating giveaway');
		if (!winners) throw new Error('winner count wasnt provided while creating giveaway');
		if (isNaN(winners)) throw new TypeError('winners should be a Number');
		if (!endAfter) throw new Error('end time wasnt provided while creating giveaway');
		if (typeof endAfter !== 'string') throw new TypeError('endAfter should be a string');
		if (!channel) throw new Error('channel wasnt provided while creating giveaway');
		const msg = await message.guild.channels.cache.get(channel).send('', {
			component: utils.giveawayButtons(host), embed: await utils.giveawayEmbed(message.client, { host, prize, endAfter, winners, requirements }),
		});
		const data = await new schema({
			messageID: msg.id,
			channelID: channel,
			guildID: msg.guild.id,
			host: host,
			winners: winners,
			prize: prize,
			startAt: Date.now(),
			endAfter: Date.now() + ms(endAfter),
			requirements: requirements,
		}).save();
		await this.startTimer(message, data);
	}

	/**
	 * @param {Discord.Message} message
	 * @param {mongoose.Document} data
	 */


	static async startTimer(message, data, instant = false) {
		if (!message) throw new Error('message not provided while starting timer.');
		if (!data) throw new Error('data not provided while starting timer');
		const msg = await message.guild.channels.cache.get(data.channelID).messages.fetch(data.messageID);
		await msg.fetch();
		const time = instant ? 0 : (data.endAfter - Date.now());
		setTimeout(async () => {
			if ((await this.getByMessageID(data.messageID)).ended) return 'ENDED';
			const winners = await utils.choose(data.winners, data.messageID);

			if (!winners) {
				message.channel.send('not enough people participated in this giveaway!');
				data.ended = true;
				data.save();
				const embed = msg.embeds[0];
				embed.description = `🎁 Prize: **${data.prize}**\n🎊 Hosted by: <@${data.host.toString()}>\n⏲️ Winner(s): none`;
				msg.edit('', { embed: embed });
				utils.editButtons(message.client, data);
				return 'NO_WINNERS';
			}

			message.channel.send(`${winners.map(winner => `<@${winner}>`).join(', ')} you won ${data.prize} Congratulations! Hosted by ${message.guild.members.cache.get(data.host).toString()}`, { component: await this.gotoGiveaway(data) });
			const dmEmbed = new Discord.MessageEmbed()
				.setTitle('You won!')
				.setDescription(`You have won a giveaway in **${msg.guild.name}**!\nPrize: [${data.prize}](https://discord.com/${msg.guild.id}/${msg.channel.id}/${data.messageID})`)
				.setColor('RANDOM')
				.setFooter('GG!');
			winners.forEach((user) => {
				message.guild.members.cache.get(user).send(dmEmbed);
			});
			const embed = msg.embeds[0];
			embed.description = `🎁 Prize: **${data.prize}**\n🎊 Hosted by: <@${data.host.toString()}>\n⏲️ Winner(s): ${winners.map(winner => `<@${winner}>`).join(', ')}`;
			msg.edit('', { embed: embed });
			data.ended = true;
			data.save();
			utils.editButtons(message.client, data);
		}, time);
	}
	static async gotoGiveaway(data) {
		if (!data) throw new Error('data not provided');
		const link = `https://discord.com/channels/${data.guildID}/${data.channelID}/${data.messageID}`;
		const button = new MessageButton().setLabel('Giveaway').setStyle('url').setURL(link);
		return button;
	}
	static async buttonclick(client, button) {
		if (!client) throw new Error('client not provided');
		if (!button) throw new Error('button not provided');
		await button.clicker.fetch();
		const id = button.id;
		if (id.startsWith('giveaways')) {
			const tag = id.split('-');
			if (tag[1] === 'enter') {
				const data = await schema.findOne({ messageID: button.message.id });
				if (data.requirements.enabled == true) {
					if (data.clickers.includes(button.clicker.user.id)) { return button.reply.send('you already entered this giveaway!', true); }
					const roles = data.requirements.roles.map(x => button.message.guild.members.cache.get(button.clicker.user.id).roles.cache.get(x));
					if (!roles[0]) {
						return button.reply.send(`You do not have the required role(s)\n${button.message.guild.roles.cache.filter(x => data.requirements.roles.includes(x.id)).filter(x => !button.message.guild.members.cache.get(button.clicker.user.id).roles.cache.get(x.id)).array().map(x => `\`${x.name}\``).join(', ')}\n for the giveaway!`, true);
					}
				}
				if (!data.clickers.includes(button.clicker.user.id)) {
					data.clickers.push(button.clicker.user.id);
					data.save();
					return button.reply.send('You have entered this giveaway! best of luck :)', true);
				}
			}
			if (tag[1] === 'reroll') {
				if (button.clicker.user.id !== tag[2]) return button.reply.send('You cannot end this giveaway as you didnt host it!', { ephemeral: true });
				try {
					button.defer();
					win = await this.reroll(client, button.message.id);
				}
				catch (err) {
					console.log(err);
					return button.message.channel.send('unable to find the giveaway!');
				}
				if (!win.length) return button.message.channel.send('There are not enough people in the giveaway!');
				button.message.channel.send(`Rerolled! <@${win}> is the new winner of the giveaway!`, { component: new MessageButton().setLabel('Giveaway').setURL(`https://discord.com/channels/${button.message.guild.id}/${button.message.channel.id}/${button.message.id}`).setStyle('url') });
			}
			if (tag[1] === 'end') {
				if (button.clicker.user.id !== tag[2]) return button.reply.send('You cannot end this giveaway as you didnt host it!', { ephemeral: true });
				await this.endByButton(client, button.message.id, button);
			}
		}
	}
	static async endByButton(client, messageID, button) {
		if (!client) throw new Error('client not provided in button end');
		if (!messageID) throw new Error('message ID not provided in button end');
		if (!button) throw new Error('button not provided in button end');
		await button.defer();
		const data = await this.getByMessageID(messageID);
		const msg = await client.guilds.cache.get(data.guildID).channels.cache.get(data.channelID).messages.fetch(messageID);
		const res = (await this.end(msg, data, msg));
		if (res == 'ENDED') button.reply.send('The giveaway has already ended!', { ephemeral: true });
	}

	static async end(message, data, giveawaymsg) {
		if (!message) throw new Error('message wasnt provided in end');
		if (!data) throw new Error('data wasnt provided in end');
		if (!giveawaymsg) throw new Error('giveawaymsg wasnt provided in end');
		if ((await this.getByMessageID(data.messageID)).ended) return 'ENDED';
		const winners = await utils.choose(data.winners, message.id);

		if (!winners) {
			message.channel.send('Not enough people participated in this giveaway.');
			data.ended = true;
			data.save();
			const embed = giveawaymsg.embeds[0];
			embed.description = `🎁 Prize: **${data.prize}**\n🎊 Hosted by: <@${data.host.toString()}>\n⏲️ Winner(s): none`;
			giveawaymsg.edit('', { embed: embed });
			utils.editButtons(message.client, data);
			return 'NO_WINNERS';
		}

		message.channel.send(`${winners.map(winner => `<@${winner}>`).join(', ')} you won ${data.prize} Congratulations! Hosted by ${message.guild.members.cache.get(data.host).toString()}`, { component: await this.gotoGiveaway(data) });
		const dmEmbed = new Discord.MessageEmbed()
			.setTitle('You won!')
			.setDescription(`You have won a giveaway in **${giveawaymsg.guild.name}**!\nPrize: [${data.prize}](https://discord.com/${giveawaymsg.guild.id}/${giveawaymsg.channel.id}/${data.messageID})`)
			.setColor('RANDOM')
			.setFooter('GG!');
		winners.forEach((user) => {
			message.guild.members.cache.get(user).send(dmEmbed);
		});
		const embed = giveawaymsg.embeds[0];
		embed.description = `🎁 Prize: **${data.prize}**\n🎊 Hosted by: <@${data.host.toString()}>\n⏲️ Winner(s): ${winners.map(winner => `<@${winner}>`).join(', ')}`;
		giveawaymsg.edit('', { embed: embed });
		data.ended = true;
		data.save();
		utils.editButtons(message.client, data);
	}
	static async reroll(client, messageID) {
		if (!client) throw new Error('client wasnt provided in reroll');
		if (!messageID) throw new Error('message ID was not provided in reroll');
		const data = await utils.getByMessageID(messageID);
		const msg = await client.guilds.cache.get(data.guildID).channels.cache.get(data.channelID).messages.fetch(messageID);
		const chosen = await utils.choose(1, messageID);
		if (!chosen) return [];
		const dmEmbed = new Discord.MessageEmbed()
			.setTitle('You won!')
			.setDescription(`You have won a giveaway in **${msg.guild.name}**!\nPrize: [${data.prize}](https://discord.com/${msg.guild.id}/${msg.channel.id}/${messageID})`)
			.setColor('RANDOM')
			.setFooter('GG!');
		chosen.forEach((user) => {
			client.users.cache.get(user).send(dmEmbed);
		});
		return chosen;
	}
	static async getByMessageID(messageID) {
		const doc = await schema.findOne({ messageID: messageID });
		if (!doc) return;
		return doc;
	}
	static async startAgain(client) {
		await schema.find({ ended: false }, async (err, data) => {
			setTimeout(async () => {
				if (err) throw err;

				for (let i = 0; i < data.length; i++) {
					const msg = await ((await client.guilds.fetch(data[i].guildID)).channels.cache.get(data[i].channelID)).messages.fetch(data[i].messageID);
					this.startTimer(msg, data[i]);
				}

			}, 10000);
		});
	}
}

module.exports = giveaways;
