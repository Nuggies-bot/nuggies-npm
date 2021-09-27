export = Applications;
declare class Applications {
    static addApplication(options: ApplicationsAddOptions): Promise<Document>;

    static deleteApplication(options: ApplicationsDeleteOptions): Promise<boolean>;

    static getDropdownComponent({ guildID: string }): Promise<Discord.MessageSelectMenu>;

    static create(options: ApplicationsCreateOptions): Promise<void>;

    static getDataByGuild(guildID: string): Document;

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