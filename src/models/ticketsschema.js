const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	guildID: {
		type: String, required: true,
	},
	parentID: {
		type: String, required: true,
	},
	bypassRoleID: {
		type: String, required: true,
	},
	pingRole: {
		type: Boolean, required: true,
	},
});

module.exports = mongoose.model('tickets', schema);