const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	guildID: {
		type: String, required: true,
	},
	applications: {
		type: Array, required: true,
	},
	responses: {
		type: Array, required: true,
	},
	channelID: String,
});

module.exports = mongoose.model('applicationsSchema', schema);