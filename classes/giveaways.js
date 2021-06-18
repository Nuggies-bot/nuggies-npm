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
		if(!message) throw new Error('message wasnt provided while creating giveaway!');
		if(!prize) throw new Error('prize wasnt provided while creating giveaway!');
		if(typeof prize !== 'string') throw new TypeError('prize should be a string');
		if(!host) throw new Error('host wasnt provided while creating giveaway');
		if(!winners) throw new Error('winner count wasnt provided while creating giveaway');
		if(isNaN(winners)) throw new TypeError('winners should be a Number');
		if(!endAfter) throw new Error('end time wasnt provided while creating giveaway');
		if(typeof endAfter !== 'string') throw new TypeError('endAfter should be a string');
		if(!channel) throw new Error('channel wasnt provided while creating giveaway');
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
		const msg = await message.guild.channels.cache.get(data.channelID).messages.fetch(data.messageID);
		await msg.fetch();
		const time = instant ? 0 : (data.endAfter - Date.now());
		console.log(time);
		setTimeout(async () => {
			if ((await utils.getByMessageID(data.messageID)).ended) return 'ENDED';
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
		const link = `https://discord.com/channels/${data.guildID}/${data.channelID}/${data.messageID}`;
		const button = new MessageButton().setLabel('Giveaway').setStyle('url').setURL(link);
		return button;
	}
	static async buttonclick(client, button) {
		await button.clicker.fetch();
		const id = button.id;
		if(id.startsWith('giveaways')) {
			const tag = id.split('-');
			if(tag[1] === 'enter') {
				const data = await schema.findOne({ messageID: button.message.id });
				if(data.clickers.includes(button.clicker.user.id)) {return button.reply.send('you already entered this giveaway!', true);}
				else if(!data.clickers.includes(button.clicker.user.id)) {
					data.clickers.push(button.clicker.user.id);
					data.save();
					return button.reply.send('You have entered this giveaway! best of luck :)', true);
				}
			}
			if(tag[1] === 'reroll') {
				if(button.clicker.user.id !== tag[2]) return button.reply.send('You cannot end this giveaway as you didnt host it!', { ephemeral: true });
				try {
					win = await this.reroll(client, button.message.id);
					console.log(button.message.id);
				}
				catch(err) {
					console.log(err);
					return button.message.channel.send('unable to find the giveaway!');
				}
				console.log(win);
				if(!win.length) return button.message.channel.send('There are not enough people in the giveaway!');
				button.message.channel.send(`Rerolled! <@${win}> is the new winner of the giveaway!`, { component:  new MessageButton().setLabel('Giveaway').setURL(`https://discord.com/channels/${button.message.guild.id}/${button.message.channel.id}/${button.message.id}`).setStyle('url') });
			}
			if(tag[1] === 'end') {
				if(button.clicker.user.id !== tag[2]) return button.reply.send('You cannot end this giveaway as you didnt host it!', { ephemeral: true });
				await this.endByButton(client, button.message.id, button);
			}
		}
	}
	static async endByButton(client, messageID, button) {
		await button.defer();
		const data = await utils.getByMessageID(messageID);
		const msg = await client.guilds.cache.get(data.guildID).channels.cache.get(data.channelID).messages.fetch(messageID);
		const res = (await this.end(msg, data, msg));
		if (res == 'ENDED') button.reply.send('The giveaway has already ended!', { ephemeral: true });
	}

	static async end(message, data, msg) {
		if ((await utils.getByMessageID(data.messageID)).ended) return 'ENDED';
		const winners = await utils.choose(data.winners, message.id);

		if (!winners) {
			message.channel.send('Not enough people participated in this giveaway.');
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
	}
	static async reroll(client, messageID) {
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
}

module.exports = giveaways;