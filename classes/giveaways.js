const utils = require('../utils');
const schema = require('../models/giveawayschema');
const Discord = require('discord.js');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
let connection;

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
		message, prize, hoster, winners, endAt, requirements, channel, embed,
	}) {
		const msg = await message.guild.channels.cache.get(channel).send('', {
			component: utils.giveawayButtons(hoster, false), embed: embed,
		});
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
	}

	/**
	 * @param {Discord.Message} message
	 * @param {mongoose.Document} data
	 */


	static async startTimer(message, data, instant = false) {
		const msg = await message.guild.channels.cache.get(data.channelID).messages.fetch(data.messageID);
		await msg.fetch();
		const time = instant ? 0 : (data.endAt - Date.now());
		setTimeout(async () => {
			if ((await utils.getByMessageID(data.messageID)).ended) return 'ENDED';
			const winners = await utils.choose(data.clickers, data.winners, data, message);

			if (!winners) {
				message.channel.send('<@833713876628406363> won lol');
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
	}
	static async buttonclick(button) {
		await button.clicker.fetch();
		const id = button.id;
		if(id.startsWith('giveaways')) {
			console.log('works till here');
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
		}
	}
}

module.exports = giveaways;