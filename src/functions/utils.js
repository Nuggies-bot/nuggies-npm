const { version } = require('discord.js');
const { DJS_STYLES, DISBUT_STYLES, toV13 } = require('../constants');

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
