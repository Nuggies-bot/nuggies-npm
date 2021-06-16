const { MessageButton, MessageActionRow } = require('discord-buttons');
const schema = require('./models/giveawayschema');
module.exports.giveawayButtons = (hoster, raw = false, emojiid) => {
	const reroll = new MessageButton()
		.setLabel('Reroll')
		.setStyle('gray')
		.setID(`giveaways-reroll-${hoster}`)
		.setDisabled(true);
	const end = new MessageButton()
		.setLabel('End')
		.setStyle('red')
		.setID(`giveaways-end-${hoster}`);

	const enter = new MessageButton()
		.setLabel('Enter')
		.setStyle('green')
		.setEmoji(emojiid)
		.setID(`giveaways-enter-${hoster}`);
	const b = raw ? [end, enter, reroll] : new MessageActionRow().addComponents([end, enter, reroll]);
	return b;
};

module.exports.choose = (clickers, winners, data, message) => {
	const final = [];
	if (data.requirements.enabled == true) clickers = clickers.filter(x => this.checkRoles(x.id, data.requirements.roles, message));
	for (let i = 0; i < winners; i++) {
		if (!clickers[0]) return final[0] ? final : null;
		const win = clickers.filter(x => !x.bot).random();
		if (!win) return final[0] ? final : null;
		clickers = clickers.filter(user => user.id !== win.id && !user.bot);
		final.push(win);
	}
	return final[0] ? final : null;
};

module.exports.checkRole = (userID, roleIDs, message) => {
	let res;
	roleIDs.forEach((roleID) => {
		const role = message.guild.roles.cache.get(roleID);
		if (!message.guild.members.cache.get(userID).roles.cache.get(role.id)) res = false;
	});
	if (res == false) return res;
	res = true;
	return res;
};
module.exports.getByMessageID = async (messageID) => {
	const doc = await schema.findOne({ messageID: messageID });

	if (!doc) return;
	return doc;
};