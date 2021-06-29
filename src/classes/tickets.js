const schema = require('../models/ticketsschema');
class tickets {
	async setParentID(categoryID, guildID) {
		const data = await schema.findOne({ guildID: guildID });
		data.parentID = categoryID;
		await data.save();
		return data;
	}
}

module.exports = tickets;