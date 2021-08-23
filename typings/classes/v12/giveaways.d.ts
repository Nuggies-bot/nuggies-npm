export = giveaways;
declare class giveaways {
	/**
	 * @param {Discord.Client} client
	 * @param {defaultManagerOptions} options
	 */
	static Messages(client: Discord.Client, options?: GiveawayMessageOptions): Promise<void>;

	static create(options: GiveawayCreateOptions): Promise<void>;

	static startTimer(message: Discord.Message, data: mongoose.Document, instant?: boolean): Promise<void>;

	static gotoGiveaway(data: mongoose.Document): MessageButton;

	static endByButton(client: Discord.Client, messageID: Discord.Snowflake, button: Discord.ButtonInteraction): Promise<void>;

	static end(message: Discord.Message, data: mongoose.Document, giveawaymsg: Discord.Message): Promise<"ENDED" | "NO_WINNERS">;

	static reroll(client: Discord.Client, messageID: Discord.Snowflake): Promise<Discord.Snowflake | []>;

	static getByMessageID(messageID: Discord.Snowflake): Promise<mongoose.Document>;

	static startAgain(client: Discord.Client): Promise<void>;

	static drop(options: GiveawayDropOptions): Promise<void>;
}
import Discord = require("discord.js");
import mongoose = require("mongoose");
import { MessageButton } from "discord-buttons";

declare interface GiveawayMessageOptions {
	dmWinner: string,
	giveaway: string,
	giveawayDescription: string,
	endedGiveawayDescription: string,
	giveawayFooterImage: string,
	winMessage: string,
	rerolledMessage: string,
	toParticipate: string,
	newParticipant: string,
	alreadyParticipated: string,
	noParticipants: string,
	noRole: string,
	dmMessage: string,
	noWinner: string,
	alreadyEnded: string,
	dropWin: string,
}

declare interface GiveawayCreateOptions {
	message: Discord.Message,
	prize: string,
	host: Discord.Snowflake,
	winners: number,
	endAfter: string,
	requirements: GiveawayRequirements,
	channel: Discord.Snowflake,
}

declare interface GiveawayRequirements {
	roles: Array<Discord.Snowflake>,
	enabled: boolean,
}

declare interface GiveawayDropOptions {
	message: Discord.Message,
	channel: Discord.Snowflake,
	prize: string,
	host: Discord.Snowflake,
}