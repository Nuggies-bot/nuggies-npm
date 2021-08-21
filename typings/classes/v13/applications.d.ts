export = Applications;
declare class Applications {
    /**
     * @param {Array} questions - Questions array
     * @param {String} name - the application name
     * @param {String} emoji - the dropdown emoji ID or unicode
     * @param {String} channel - the channel ID of the channel which will recieve the answers
     * @param {String} description - the description of the dropdown
     * @param {String} label - The dropdown label
     * @param {Number} maxApps - The amount of responses
     */
    static addApplication(options: ApplicationsAddOptions): Promise<Document>;
    static deleteApplication(options: ApplicationsDeleteOptions): Promise<boolean>;
    static getDropdownComponent({ guildID }: {
        guildID: Discord.Snowflake;
    }): Promise<Discord.MessageSelectMenu>;
    static create(options: ApplicationsCreateOptions): Promise<void>;
    /**
     * @param {String} guildID
     * @returns {Document}
     */
    static getDataByGuild(guildID: Discord.Snowflake): Document;
    /**
     *
     * @param {Discord.Message} message - The discord message
     */
    static setup(message: Discord.Message): Promise<void>;
}
import Discord = require("discord.js");
import { Document } from "mongoose";

declare interface ApplicationsAddOptions {
	guildID: Discord.Snowflake,
	questions: Array<string>,
	name: string,
	emoji: Discord.EmojiResolvable,
	channel: Discord.Snowflake,
	description: string,
	label: string,
	maxApps: number,
	cooldown: number,
	responseChannelID: Discord.Snowflake,
}

declare interface ApplicationsDeleteOptions {
	guildID: Discord.Snowflake,
	name: string,
}

declare interface ApplicationsCreateOptions {
	guildID: Discord.Snowflake,
	content: string | Discord.MessageEmbed,
	client: Discord.Client,
}