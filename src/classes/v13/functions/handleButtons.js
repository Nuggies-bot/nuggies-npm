const Discord = require('discord.js');
let win;
const schema = require('../../../models/giveawayschema');
const giveaways = require('../giveaways');
module.exports = async (client, button) => {
	await button.member.fetch();
	const id = button.customId;
	if (id.startsWith('giveaways')) {
		const tag = id.split('-');
		if (tag[1] === 'enter') {
			const data = await schema.findOne({ messageID: button.message.id });
			if (data.requirements.enabled == true) {
				if (data.clickers.includes(button.user.id)) { return button.reply({ content: client.customMessages.giveawayMessages.alreadyParticipated, ephemeral: true }); }
				const roles = data.requirements.roles.map(x => button.guild.members.cache.get(button.user.id).roles.cache.get(x));
				if (!roles[0]) {
					const requiredRoles = button.guild.roles.cache.filter(x => data.requirements.roles.includes(x.id)).filter(x => !button.guild.members.cache.get(button.user.id).roles.cache.get(x.id)).array().map(x => `\`${x.name}\``).join(', ');
					return button.reply({ content: client.customMessages.giveawayMessages.nonoRole.replace(/{requiredRoles}/g, requiredRoles), ephemeral: true });
				}
			}
			if (!data.clickers.includes(button.user.id)) {
				data.clickers.push(button.user.id);
				data.save();
				return button.reply({ content: client.customMessages.giveawayMessages.newParticipant, ephemeral: true });
			}
			if (data.clickers.includes(button.user.id)) {
				return button.reply({ content: client.customMessages.giveawayMessages.alreadyParticipated, ephemeral: true });
			}
		}
		if (tag[1] === 'reroll') {
			if (button.user.id !== tag[2]) return button.reply({ ephemeral: true, content: 'You Cannot Reroll This Giveaway, Only The Host Can' });
			try {
				button.reply({ content: 'Rerolled!', ephemeral: true });
				win = await giveaways.reroll(client, button.message.id);
			}
			catch (err) {
				console.log(err);
				return button.message.channel.send('⚠️ **Unable To Find That Giveaway**');
			}
			if (!win.length) return button.message.channel.send(client.customMessages.giveawayMessages.nonoParticipants);
			button.message.channel.send({ content: client.customMessages.giveawayMessages.rerolledMessage.replace(/{winner}/g, `<@${win}>`), components: [new Discord.MessageActionRow().addComponents([new Discord.MessageButton().setLabel('Giveaway').setURL(`https://discord.com/channels/${button.message.guild.id}/${button.message.channel.id}/${button.message.id}`).setStyle('LINK')])] });
		}
		if (tag[1] === 'end') {
			if (button.user.id !== tag[2]) return button.reply({ content: 'You Cannot End This Giveaway, Only The Host Can', ephemeral: true });
			await giveaways.endByButton(client, button.message.id, button);
		}
	}
	if (id.startsWith('br')) {
		let member;
		const fetchMem = await button.guild.members.fetch(button.member.id, false);
		if (fetchMem) member = button.guild.members.cache.get(button.member.id);
		await member.fetch(true);
		const role = id.split(':')[1];
		if (button.member.roles.cache.has(role)) {
			button.member.roles.remove(role);
			button.reply({ content: `I have removed the <@&${role}> role from you!`, ephemeral: true });
		}
		else {
			button.member.roles.add(role);
			button.reply({ content: `I have added the <@&${role}> role to you!`, ephemeral: true });
		}
	}
};
