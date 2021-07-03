const utils = require('../utils');
const schema = require('../models/giveawayschema');
const { MessageButton } = require('discord-buttons');
const Discord = require('discord.js');
const mongoose = require('mongoose');
const ms = require('ms');
mongoose.set('useFindAndModify', false);
let win;

class giveaways {
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
		if (!message) throw new Error('NuggiesError: message wasnt provided while creating giveaway!');
		if (!prize) throw new Error('NuggiesError: prize wasnt provided while creating giveaway!');
		if (typeof prize !== 'string') throw new TypeError('NuggiesError: prize should be a string');
		if (!host) throw new Error('NuggiesError: host wasnt provided while creating giveaway');
		if (!winners) throw new Error('NuggiesError: winner count wasnt provided while creating giveaway');
		if (isNaN(winners)) throw new TypeError('NuggiesError: winners should be a Number');
		if (!endAfter) throw new Error('NuggiesError:  time wasnt provided while creating giveaway');
		if (typeof endAfter !== 'string') throw new TypeError('NuggiesError: endAfter should be a string');
		if (!channel) throw new Error('NuggiesError: channel wasnt provided while creating giveaway');
		const msg = await message.guild.channels.cache.get(channel).send('', {
			buttons: utils.getButtons(host), embed: await utils.giveawayEmbed(message.client, { host, prize, endAfter, winners, requirements }),
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
		if (!message) throw new Error('NuggiesError: message not provided while starting timer.');
		if (!data) throw new Error('NuggiesError: data not provided while starting timer');
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
		if (!data) throw new Error('NuggiesError: data not provided');
		const link = `https://discord.com/channels/${data.guildID}/${data.channelID}/${data.messageID}`;
		const button = new MessageButton().setLabel('Giveaway').setStyle('url').setURL(link);
		return button;
	}
	static async endByButton(client, messageID, button) {
		if (!client) throw new Error('NuggiesError: client not provided in button end');
		if (!messageID) throw new Error('NuggiesError:  ID not provided in button end');
		if (!button) throw new Error('NuggiesError: button not provided in button end');
		const data = await this.getByMessageID(messageID);
		const msg = await client.guilds.cache.get(data.guildID).channels.cache.get(data.channelID).messages.fetch(messageID);
		const res = (await this.end(msg, data, msg));
		if (res == 'ENDED') button.reply.send('The giveaway has already ended!', { ephemeral: true });
	}

	static async end(message, data, giveawaymsg) {
		if (!message) throw new Error('NuggiesError: message wasnt provided in end');
		if (!data) throw new Error('NuggiesError: data wasnt provided in end');
		if (!giveawaymsg) throw new Error('NuggiesError: giveawaymsg wasnt provided in end');
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
		if (!client) throw new Error('NuggiesError: client wasnt provided in reroll');
		if (!messageID) throw new Error('NuggiesError: message ID was not provided in reroll');
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
	static async drop({ message, channel, prize, host }) {
		let ended = false;
		if(!channel) throw new Error('NuggiesError: channel ID not provided');
		if(!host) throw new Error('NuggiesError: host not provided');
		if(!prize) throw new Error('NuggiesError: prize not provided');
		if(!message) throw new Error('NuggiesError: message not provided');
		const m = await message.client.channels.cache.get(channel).send({ embed: await utils.dropEmbed(message.client, { prize: prize, host: host }), component: await utils.dropButtons(prize) });
		const filter = (button) => button.clicker.user.id === message.author.id;
		const collector = await m.createButtonCollector(filter, { time: 90000, max: 1 });
		collector.on('collect', async (b) => {
			b.defer();
			ended = true;
			b.channel.send(`<@${b.clicker.user.id}> won the drop congratulations!!`);
			await utils.editDropButtons(m.client, b);
			return collector.stop('end');
		});
	}
}

module.exports = giveaways;
