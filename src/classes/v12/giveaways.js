/* eslint-disable no-inline-comments */
const utils = require('../../functions/giveawayUtils');
const schema = require('../../models/giveawayschema');
const { MessageButton } = require('discord-buttons');
const Discord = require('discord.js');
const mongoose = require('mongoose');
const ms = require('ms');
const merge = require('deepmerge');
const defaultGiveawayMessages = {
	dmWinner: true,
	giveaway: '🎉🎉 **GIVEAWAY!** 🎉🎉',
	giveawayDescription: '🎁 Prize: **{prize}**\n🎊 Hosted by: {hostedBy}\n⏲️ Winner(s): `{winners}` \n 👨‍🦱 participants: {totalParticipants} \n\n**Requirements:** {requirements}',
	endedGiveawayDescription : '🎁 Prize: **{prize}**\n🎊 Hosted by: {hostedBy}\n⏲️ Winner(s): {winners}',
	giveawayFooterImage: 'https://cdn.discordapp.com/emojis/843076397345144863.png',
	winMessage: 'congrats {winners}! you won `{prize}`!! Total `{totalParticipants}` members participated and your winning percentage was `{winPercentage}%`',
	rerolledMessage: 'Rerolled! {winner} is the new winner of the giveaway!', // only {winner} placeholder
	toParticipate: '**Click the Enter button to enter the giveaway!**',
	newParticipant: 'You have successfully entered for this giveaway! your win percentage is `{winPercentage}%` among `{totalParticipants}` other participants', // no placeholders | ephemeral
	alreadyParticipated: 'you already entered this giveaway!', // no placeholders | ephemeral
	noParticipants: 'There are not enough people in the giveaway!', // no placeholders
	noRole: 'You do not have the required role(s)\n{requiredRoles}\n for the giveaway!', // only {requiredRoles} | ephemeral
	dmMessage: 'You have won a giveaway in **{guildName}**!\nPrize: [{prize}]({giveawayURL})',
	noWinner: 'Not enough people participated in this giveaway.', // no {winner} placerholder
	alreadyEnded: 'The giveaway has already ended!', // no {winner} placeholder
	dropWin: '{winner} Won The Drop!!',
	noWeeklyExp: 'you dont have the required minimum weekly xp to join this giveaway',
	noLevel: 'You dont have the minimum required level to join this giveaway',
	nonoRole: 'You do not have the {requiredRoles} role(s) which is required to join this giveaway',
	editParticipants: true,
};

mongoose.set('useFindAndModify', false);

class giveaways {

	/**
	 * @param {Discord.Client} client
	 * @param {defaultGiveawayMessages} options
	 */
	static async Messages(client, options = {}) {
		this.client = client;
		client.customMessages = {
			giveawayMessages: merge(defaultGiveawayMessages, options),
		};
	}

	static async create(client, {
		prize, host, winners, endAfter, requirements, channelID,
	}) {
		if (!client) throw new Error('NuggiesError: client wasnt provided while creating giveaway!');
		if (!client.customMessages || !client.customMessages.giveawayMessages) {
			client.customMessages = {
				giveawayMessages: defaultGiveawayMessages,
			};
		}
		if (!prize) throw new Error('NuggiesError: prize wasnt provided while creating giveaway!');
		if (typeof prize !== 'string') throw new TypeError('NuggiesError: prize should be a string');
		if (!host) throw new Error('NuggiesError: host wasnt provided while creating giveaway');
		if (!winners) throw new Error('NuggiesError: winner count wasnt provided while creating giveaway');
		if (isNaN(winners)) throw new TypeError('NuggiesError: winners should be a Number');
		if (!endAfter) throw new Error('NuggiesError:  time wasnt provided while creating giveaway');
		if (typeof endAfter !== 'string') throw new TypeError('NuggiesError: endAfter should be a string');
		if (!channelID) throw new Error('NuggiesError: channel ID wasnt provided while creating giveaway');
		const msg = await client.channels.cache.get(channelID).send(client.customMessages.giveawayMessages.giveaway, {
			buttons: utils.getButtons(host), embed: await utils.giveawayEmbed(client, { host, prize, endAfter, winners, requirements }),
		});
		const data = await new schema({
			messageID: msg.id,
			channelID: channelID,
			guildID: msg.guild.id,
			host: host,
			winners: winners,
			prize: prize,
			startAt: Date.now(),
			endAfter: Date.now() + ms(endAfter),
			requirements: requirements,
		}).save();
		await this.startTimer(msg, data);
	}

	/**
	 * @param {Discord.Message} message
	 * @param {mongoose.Document} data
	 */

	static async startTimer(message, data, instant = false) {
		if (!message.client.customMessages.giveawayMessages) message.client.customMessages.giveawayMessages = defaultGiveawayMessages;
		if (!message) throw new Error('NuggiesError: message not provided while starting timer.');
		if (!data) throw new Error('NuggiesError: data not provided while starting timer');
		const msg = await message.guild.channels.cache.get(data.channelID).messages.fetch(data.messageID);
		await msg.fetch();
		const time = instant ? 0 : (data.endAfter - Date.now());
		setTimeout(async () => {
			if ((await this.getByMessageID(data.messageID)).ended) return 'ENDED';
			const winners = await utils.choose(data.winners, data.messageID);

			if (!winners) {
				msg.channel.send(replacePlaceholders(message.client.customMessages.giveawayMessages.noWinner, data, msg));
				data.ended = true;
				data.save().catch((err) => {
					console.log(err);
				});
				const embed = msg.embeds[0];
				embed.description = replacePlaceholders(message.client.customMessages.giveawayMessages.endedGiveawayDescription, data, msg);
				msg.edit('', { embed: embed });
				utils.editButtons(message.client, data);
				return 'NO_WINNERS';
			}
			message.channel.send(replacePlaceholders(message.client.customMessages.giveawayMessages.winMessage, await this.getByMessageID(data.messageID), msg, winners));


			if (message.client.customMessages.giveawayMessages.dmWinner) {
				const dmEmbed = new Discord.MessageEmbed()
					.setTitle('You Won!')
					.setDescription(replacePlaceholders(message.client.customMessages.giveawayMessages.dmMessage, data, msg, winners))
					.setColor('RANDOM')
					.setThumbnail(msg.guild.iconURL({ dynamic: true }))
					.setFooter('GG!');
				winners.forEach((user) => {
					message.guild.members.cache.get(user).send(dmEmbed);
				});
			}

			const embed = msg.embeds[0];
			embed.description = replacePlaceholders(message.client.customMessages.giveawayMessages.endedGiveawayDescription, data, msg, winners);
			msg.edit('', { embed: embed }).catch((err) => console.log(err));
			data.ended = true;
			data.save().catch((err) => {
				console.log(err);
			});
			utils.editButtons(message.client, data);
		}, time);
	}
	static gotoGiveaway(data) {
		if (!data) throw new Error('NuggiesError: data not provided');
		const link = `https://discord.com/channels/${data.guildID}/${data.channelID}/${data.messageID}`;
		const button = new MessageButton().setLabel('Giveaway').setStyle('url').setURL(link);
		return button;
	}
	static async endByButton(client, messageID, button) {
		if (!client.customMessages.giveawayMessages) client.customMessages.giveawayMessages = defaultGiveawayMessages;
		if (!client) throw new Error('NuggiesError: client not provided in button end');
		if (!messageID) throw new Error('NuggiesError: ID not provided in button end');
		if (!button) throw new Error('NuggiesError: button not provided in button end');
		const data = await this.getByMessageID(messageID);
		const msg = await client.guilds.cache.get(data.guildID).channels.cache.get(data.channelID).messages.fetch(messageID);
		const res = (await this.end(msg, data, msg));
		if (res == 'ENDED') button.reply.send(replacePlaceholders(client.customMessages.giveawayMessages.alreadyEnded, data, msg), { ephemeral: true });
	}

	static async end(message, data, giveawaymsg) {
		if (!message.client.customMessages.giveawayMessages) message.client.customMessages.giveawayMessages = defaultGiveawayMessages;
		if (!message) throw new Error('NuggiesError: message wasnt provided in end');
		if (!data) throw new Error('NuggiesError: data wasnt provided in end');
		if (!giveawaymsg) throw new Error('NuggiesError: giveawaymsg wasnt provided in end');
		const newData = await this.getByMessageID(data.messageID);
		if (newData.ended) return 'ENDED';
		const winners = await utils.choose(data.winners, message.id);
		const msg = await message.client.guilds.cache.get(data.guildID).channels.cache.get(data.channelID).messages.fetch(data.messageID);

		if (!winners) {
			message.channel.send(replacePlaceholders(message.client.customMessages.giveawayMessages.noWinner, newData, msg));
			data.ended = true;
			data.save();
			const embed = giveawaymsg.embeds[0];
			embed.description = replacePlaceholders(message.client.customMessages.giveawayMessages.endedGiveawayDescription, newData, msg);
			giveawaymsg.edit('', { embed: embed }).catch((err) => console.log(err));
			utils.editButtons(message.client, data);
			return 'NO_WINNERS';
		}
		message.channel.send(replacePlaceholders(message.client.customMessages.giveawayMessages.winMessage, newData, msg, winners));
		if (message.client.customMessages.giveawayMessages.dmWinner) {
			const dmEmbed = new Discord.MessageEmbed()
				.setTitle('You Won!')
				.setDescription(replacePlaceholders(message.client.customMessages.giveawayMessages.dmMessage, newData, msg, winners))
				.setColor('RANDOM')
				.setThumbnail(msg.guild.iconURL({ dynamic: true }))
				.setFooter('GG!');
			winners.forEach((user) => {
				message.guild.members.cache.get(user).send(dmEmbed);
			});
		}

		const embed = giveawaymsg.embeds[0];
		embed.description = replacePlaceholders(message.client.customMessages.giveawayMessages.endedGiveawayDescription, newData, msg, winners);
		giveawaymsg.edit('', { embed: embed }).catch((err) => console.log(err));
		data.ended = true;
		data.save().catch((err) => {
			console.log(err);
		});
		utils.editButtons(message.client, data);
	}
	static async reroll(client, messageID) {
		if (!client.customMessages.giveawayMessages) client.customMessages.giveawayMessages = defaultGiveawayMessages;
		if (!client) throw new Error('NuggiesError: client wasnt provided in reroll');
		if (!messageID) throw new Error('NuggiesError: message ID was not provided in reroll');
		const data = await utils.getByMessageID(messageID);
		const msg = await client.guilds.cache.get(data.guildID).channels.cache.get(data.channelID).messages.fetch(messageID);
		const chosen = await utils.choose(1, messageID);
		if (!chosen) return [];
		const dmEmbed = new Discord.MessageEmbed()
			.setTitle('You Won!')
			.setDescription(replacePlaceholders(client.customMessages.giveawayMessages.dmMessage, data, msg, chosen))
			.setColor('RANDOM')
			.setThumbnail(msg.guild.iconURL({ dynamic: true }))
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
					const guild = await client.guilds.fetch(data[i].guildID);
					if (!guild) return data.delete();
					const channel = await guild.channels.cache.get(data[i].channelID);
					if (!channel) return data.delete();
					const msg = await channel.messages.fetch(data[i].messageID);
					if (!msg) return data.delete();
					this.startTimer(msg, data[i]);
				}

			}, 10000);
		});

		if (client.customMessages.giveawayMessages.editParticipants) {
			setInterval(async () => {
				const docs = await schema.find({ ended: false });
				for (let i = 0; i < docs.length; i++) {
					const guild = client.guilds.cache.get(docs[i].guildID);
					if (!guild) return;
					const channel = await guild.channels.fetch(docs[i].channelID, true, false);
					if (!channel) return;
					const msg = await channel.messages.fetch(docs[i].messageID, true, false);
					if (!msg) return;
					const embed = msg.embeds[0];
					const req = docs[i].requirements.enabled ? docs[i].requirements.roles.map(x => `<@&${x}>`).join(', ') : 'None!';
					embed.description = `${client.customMessages.giveawayMessages.toParticipate}\n${(client.customMessages.giveawayMessages.giveawayDescription).replace(/{requirements}/g, req).replace(/{hostedBy}/g, `<@!${docs[i].host}>`).replace(/{prize}/g, docs[i].prize).replace(/{winners}/g, docs[i].winners).replace(/{totalParticipants}/g, docs[i].clickers.length.toString())}`;
					msg.edit({ embeds: [embed] });
				}
			}, 10 * 1000);
		}
	}
	static async drop(client, { channelID, prize, host }) {
		// eslint-disable-next-line no-unused-vars
		let ended;
		if (!client) throw new Error('NuggiesError: client not provided');
		if (!client.customMessages || !client.customMessages.giveawayMessages) {
			client.customMessages = {
				giveawayMessages: defaultGiveawayMessages,
			};
		}
		if (!channelID) throw new Error('NuggiesError: channel ID not provided');
		if (!host) throw new Error('NuggiesError: host ID not provided');
		if (!prize) throw new Error('NuggiesError: prize not provided');

		const m = await client.channels.cache.get(channelID).send({ embed: await utils.dropEmbed(client, { prize: prize, host: host }), component: await utils.dropButtons(prize) });
		const filter = (button) => button.clicker.user.id === host;
		const collector = await m.createButtonCollector(filter, { time: 90000, max: 1 });
		collector.on('collect', async (b) => {
			if (!b.client.customMessages || !b.client.customMessages.giveawayMessages) {
				b.client.customMessages = {
					giveawayMessages: defaultGiveawayMessages,
				};
			}
			b.reply.defer();
			ended = true;
			b.channel.send(b.client.customMessages.giveawayMessages.dropWin.replace(/{winner}/g, `<@${b.clicker.user.id}>`));
			await utils.editDropButtons(m.client, b);
			return collector.stop('end');
		});
	}
}
function replacePlaceholders(string, data, msg, winners = []) {
	const newString = string.replace(/{guildName}/g, msg.guild.name).replace(/{totalParticipants}/g, data.clickers.length).replace(/{prize}/g, data.prize).replace(/{winPercentage}/g, (winners.length / data.clickers.length) * 100).replace(/{giveawayURL}/g, `https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${data.messageID}`).replace(/{hostedBy}/g, msg.guild.members.cache.get(data.host).toString()).replace(/{winners}/g, winners.length > 0 ? winners.map(winner => `<@${winner}>`).join(', ') : 'none' || 'none');
	return newString;
}
module.exports = giveaways;
