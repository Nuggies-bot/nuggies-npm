const applications = require('../applications');
const ms = require('ms');
const Discord = require('discord.js');
const defaultDropdownRolesMessages = {
	addMessage: 'I have added the {role} role to you!',
	removeMessage: 'I have removed the {role} role from you!',
};
/**
 * @param {Discord.Client} client
 * @param {Discord.SelectMenuInteraction} menu
 */
module.exports = async (client, menu) => {
	if (!menu.guild) return;
	if (!client.customMessages || !client.customMessages.dropdownRolesMessages) {
		client.customMessages = {
			dropdownRolesMessages: defaultDropdownRolesMessages,
		};
	}
	await menu.member.fetch();
	if (menu.customId == 'app') {
		const app = menu.values[0];
		const data = await applications.getDataByGuild(menu.guild.id);
		if (!data) return menu.reply({ content: 'Something went wrong!', ephemeral: true });
		const last = data.responses.find(x => x.userID == menu.user.id);
		if (last) {
			if ((Date.now() - last.createdAt) < data.applicationCooldown) return menu.reply({ content: `You cannot create another application for ${ms((last.createdAt + data.applicationCooldown) - Date.now(), { long: true })}`, ephemeral: true });
		}
		const responses = data.responses.filter(x => x.userID == menu.user.id && x.accepted == undefined && x.declined == undefined);
		if (responses.length == data.maxApplicationsFromUser) return menu.reply({ content: 'You cannot submit any more responses as you have reached the limit', ephemeral: true });
		const index = await data.applications.find((application) => {
			return application.name === app;
		});
		let step = 0;
		const embed = new Discord.MessageEmbed().setColor('RANDOM').setTitle(`Application: ${app}`).setFooter(`Question: 1/${index.questions.length}`);
		const msg = await menu.user.send({ embeds: [embed.setDescription(index.questions[0])] });
		const collector = msg.channel.createMessageCollector({ filter: m => !m.author.bot, max: index.questions.length });
		const res = { userID: menu.user.id, answers: [], createdAt: Date.now(), app };
		collector.on('collect', m => {
			if (!m.content) return collector.stop('ERROR');
			res.answers
				.push({ question: index.questions[step], answer: m.content });
			step++;
			if (step == index.questions.length) {
				m.channel.send('Your application has been completed!');
				return collector.stop('DONE');
			}
			msg.channel.send({ embeds: [embed.setDescription(index.questions[step]).setFooter(`Question: ${step + 1}/${index.questions.length}`)] });
		});
		collector.on('end', async (msgs, reason) => {
			if (reason == 'ERROR') {
				return msg.channel.send('That is not a valid answer');
			}
			if (reason == 'DONE') {
				const newdata = await applications.getDataByGuild(menu.message.guild.id);
				newdata.responses.push(res);
				await newdata.save();
				const c = await client.channels.fetch(data.responseChannel, true, false);
				if (!c) return;
				c.send({ embeds: [new Discord.MessageEmbed().setTitle('New response').setDescription(`Application: ${app}\nUser: ${menu.user} - \`${menu.user.id}\``).addFields(res.answers.map(x => { return { name: `Question: ${x.question}`, value: `Answer: ${x.answer}`, inline: true }; })).setColor('RANDOM').setFooter(menu.user.tag, menu.user.displayAvatarURL())] });
			}
		});
		menu.reply({ content: `Check your DMs! Or click this link ${msg.url}`, ephemeral: true });
	}

	if (menu.customId.startsWith('dr-')) {
		const type = menu.customId.split('-')[1];
		let member;
		const fetchMem = await menu.guild.members.fetch(menu.member.id, false);
		if (fetchMem) member = menu.guild.members.cache.get(menu.member.id);
		await member.fetch(true);
		if (type === 'multiple') {
			let msg = '';
			for(let i = 0; i < menu.values.length; i++) {
				const role = menu.values[i];
				if (menu.member.roles.cache.has(role)) {
					menu.member.roles.remove(role);
					msg += client.customMessages.dropdownRolesMessages.removeMessage.replace(/{role}/g, `<@&${role}>`) + '\n';
				}
				else {
					menu.member.roles.add(role);
					msg += client.customMessages.dropdownRolesMessages.addMessage.replace(/{role}/g, `<@&${role}>`) + '\n';
				}
			}
			menu.reply({ content: msg, ephemeral: true });
		}
		else if (type === 'single') {
			if (menu.member.roles.cache.has(menu.values[0])) {
				menu.member.roles.remove(menu.values[0]);
				menu.reply({ content: client.customMessages.dropdownRolesMessages.removeMessage.replace(/{role}/g, `<@&${menu.values[0]}>`), ephemeral: true });
			}
			else {
				menu.member.roles.add(menu.values[0]);
				menu.reply({ content: client.customMessages.dropdownRolesMessages.addMessage.replace(/{role}/g, `<@&${menu.values[0]}>`), ephemeral: true });
			}
		}
	}
};
