const { version } = require('discord.js');
const { DJS_STYLES, DISBUT_STYLES, toV13 } = require('../constants');
const https = require('https');
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

module.exports.getAmariData = (key, userID, guildID) => {
	const options = {
		hostname: 'amaribot.com',
		path: `/api/v1/guild/${guildID}/member/${userID}`,
		auth: key,
		method: 'GET',
		port: 8000,
	};
	const req = https.request(options, res => {
		res.on('data', data => {
			if(!res.statusCode == 200) {return 'ERROR_CODE';}
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
};