const applications = require('../applications');
const Discord = require('discord.js');
const ms = require('ms');
const defaultDropdownRolesMessages = {
	addMessage: 'I have added the {role} role to you!',
	removeMessage: 'I have removed the {role} role from you!',
};

module.exports = async (client, menu) => {
	if (!menu.guild) return;
	if (!client.customMessages || !client.customMessages.dropdownRolesMessages) {
		client.customMessages = {
			dropdownRolesMessages: defaultDropdownRolesMessages,
		};
	}
	await menu.clicker.fetch();
	if (menu.id == 'app') {
		const app = menu.values[0];
		const data = await applications.getDataByGuild(menu.guild.id);
		if (!data) return menu.reply.send({ content: 'Something went wrong!', ephemeral: true });
		const last = data.responses.find(x => x.userID == menu.clicker.user.id);
		if (last) {
			if ((Date.now() - last.createdAt) < data.applicationCooldown) return menu.reply.send({ content: `You cannot create another application for ${ms((last.createdAt + data.applicationCooldown) - Date.now(), { long: true })}`, ephemeral: true });
		}
		const responses = data.responses.filter(x => x.userID == menu.clicker.user.id && x.accepted == undefined && x.declined == undefined);
		if (responses.length == data.maxApplicationsFromUser) return menu.reply.send({ content: 'You cannot submit any more responses as you have reached the limit', ephemeral: true });
		const index = await data.applications.find((application) => {
			return application.name === app;
		});
		let step = 0;
		const embed = new Discord.MessageEmbed().setColor('RANDOM').setTitle(`Application: ${app}`).setFooter(`Question: 1/${index.questions.length}`);
		const msg = await menu.clicker.user.send(embed.setDescription(index.questions[0]));
		const collector = msg.channel.createMessageCollector(m => !m.author.bot, { max: index.questions.length });
		const res = { userID: menu.clicker.user.id, answers: [], createdAt: Date.now(), app };
		collector.on('collect', m => {
			if (!m.content) return collector.stop('ERROR');
			res.answers
				.push({ question: index.questions[step], answer: m.content });
			step++;
			if (step == index.questions.length) {
				m.channel.send('Your application has been completed!');
				return collector.stop('DONE');
			}
			msg.channel.send(embed.setDescription(index.questions[step]).setFooter(`Question: ${step + 1}/${index.questions.length}`));
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
				c.send({ embed: new Discord.MessageEmbed().setTitle('New response').setDescription(`Application: ${app}\nUser: ${menu.clicker.user} - \`${menu.clicker.user.id}\``).addFields(res.answers.map(x => { return { name: `Question: ${x.question}`, value: `Answer: ${x.answer}`, inline: true }; })).setColor('RANDOM').setFooter(menu.clicker.user.tag, menu.clicker.user.displayAvatarURL()) });
			}
		});
		menu.reply.send({ content: `Check your DMs! Or click this link ${msg.url}`, ephemeral: true });
	}
	if (menu.id.startsWith('dr')) {
		const type = menu.id.split('-')[1];
		let member;
		const fetchMem = await menu.guild.members.fetch(menu.clicker.id, false);
		if (fetchMem) member = menu.guild.members.cache.get(menu.clicker.id);
		await member.fetch(true);
		if (type === 'multiple') {
			let msg = '';
			for(let i = 0; i < menu.values.length; i++) {
				const role = menu.values[i];
				if (menu.clicker.member.roles.cache.has(role)) {
					menu.clicker.member.roles.remove(role);
					msg += client.customMessages.dropdownRolesMessages.removeMessage.replace(/{role}/g, `<@&${role}>`) + '\n';
				}
				else {
					menu.clicker.member.roles.add(role);
					msg += client.customMessages.dropdownRolesMessages.addMessage.replace(/{role}/g, `<@&${role}>`) + '\n';
				}
			}
			menu.reply.send({ content: msg, ephemeral: true });
		}
		else if (type === 'single') {
			if (menu.clicker.member.roles.cache.has(menu.values[0])) {
				menu.clicker.member.roles.remove(menu.values[0]);
				menu.reply.send({ content: client.customMessages.dropdownRolesMessages.removeMessage.replace(/{role}/g, `<@&${menu.values[0]}>`), ephemeral: true });
			}
			else {
				menu.clicker.member.roles.add(menu.values[0]);
				menu.reply.send({ content: client.customMessages.dropdownRolesMessages.addMessage.replace(/{role}/g, `<@&${menu.values[0]}>`), ephemeral: true });
			}
		}
	}
};
