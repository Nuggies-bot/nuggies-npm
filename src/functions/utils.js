const { version } = require('discord.js');
const { DJS_STYLES, DISBUT_STYLES, toV13 } = require('../constants');
const https = require('https');
const AsyncQueue = require('@sapphire/async-queue');
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

module.exports.getAmariData = async (key, userID, guildID, type) => {
	try {
		const options = {
			hostname: 'amaribot.com',
			path: `/api/v1/guild/${guildID}/member/${userID}`,
			auth: key,
			method: 'GET',
			port: 8000,
		};
		await queue.wait();
		const req = https.request(options, result => {
			result.on('data', data => {
				if(!result.statusCode == 200) {return 'ERROR_CODE';}
				else {
					return data.toString();
				}
			});
		});
		req.on('error', error => {
			console.error(error);
			return 'ERROR_CODE';
		});

		req.end();
	}
	catch(e) {
		console.log(e);
	}
	finally {
		queue.shift();
	}
};