const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	ID: {
		type: String, required: true,
	},
	type: {
		type: String, required: true, default: 'multiple',
	},
	roles: {
		type: Array, default: [],
	},
});

module.exports = mongoose.model('dropdownSchema', schema);