const { version } = require('discord.js');
const { DJS_STYLES, DISBUT_STYLES, toV13 } = require('../constants');
const axios = require('axios');
const { AsyncQueue } = require('@sapphire/async-queue');
const queue = new AsyncQueue();
module.exports.convertButtonStyle = (style) => {
	const isv13 = version.startsWith('13');
	if (this.isDjsButtonStyle(style) === null) throw new Error('Invalid style provided');
	if (isv13 && this.isDjsButtonStyle(style)) return style;
	if (!isv13 && !this.isDjsButtonStyle(style)) return style;
	if (isv13 && !this.isDjsButtonStyle(style)) return toV13[style] || null;
	if (!isv13 && this.isDjsButtonStyle(style)) return Object.values(toV13).indexOf;
};

module.exports.isDjsButtonStyle = (style) => {
	if (!DJS_STYLES.includes(style) && !DISBUT_STYLES.includes(style)) return null;
	return DJS_STYLES.includes(style);
};

module.exports.getAmariData = async (key, userID, guildID) => {
	try {
		queue.wait();
		const options = {
			url: `https://amaribot.com/api/v1/guild/${guildID}/member/${userID}`,
			method: 'GET',
			headers: {
				Authorization: key,
				'Content-Type': 'application/json',
			},
		};

		const res = await axios.request(options);
		if(!res.statusCode == 200) {return 'ERROR_CODE';}
		else {
			return res.data;
		}
	}
	catch(e) {
		console.log(e);
	}
	finally {
		queue.shift();
	}
};