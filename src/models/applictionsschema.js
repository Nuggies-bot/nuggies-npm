const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	guildID: {
		type: String, required: true,
	},
	applications: {
		type: Array, required: true,
	},
	responses: {
		type: Array, default: [],
	},
	channelID: { type: String },
	responseChannel: { type: String },
	maxApplicationsFromUser: { type: Number, default: 1 },
	// eslint-disable-next-line no-inline-comments
	applicationCooldown: { type: Number, default: 3600000 }, // Or 1 hour
});

module.exports = mongoose.model('applicationsSchema', schema);