export = Giveaways;
declare class Giveaways {
	static Messages(client: Discord.Client, options?: GiveawayMessageOptions): void;

	static create(client: Discord.Client, options: GiveawayCreateOptions): Promise<void>;

	static startTimer(message: Discord.Message, data: mongoose.Document, instant?: boolean): Promise<void>;

	static gotoGiveaway(data: mongoose.Document): Discord.MessageButton;

	static endByButton(client: Discord.Client, messageID: Discord.Snowflake, button: Discord.ButtonInteraction): Promise<void>;

	static end(message: Discord.Message, data: mongoose.Document, giveawaymsg: Discord.Message): Promise<"ENDED" | "NO_WINNERS">;

	static reroll(client: Discord.Client, messageID: Discord.Snowflake): Promise<Discord.Snowflake | []>;

	static getByMessageID(messageID: Discord.Snowflake): Promise<mongoose.Document>;

	static startAgain(client: Discord.Client): Promise<void>;

	static drop(client: Discord.Client, options: GiveawayDropOptions): Promise<void>;
}
import Discord = require("discord.js");
import mongoose = require("mongoose");

declare interface GiveawayMessageOptions {
	dmWinner: boolean,
	dmHost: boolean,
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
	prize: string,
	host: Discord.Snowflake,
	winners: number,
	endAfter: string,
	requirements: GiveawayRequirements,
	channelID: Discord.Snowflake,
}

declare interface GiveawayRequirements {
	roles: Array<Discord.Snowflake>,
	enabled: boolean,
}

declare interface GiveawayDropOptions {
	channelID: Discord.Snowflake,
	prize: string,
	host: Discord.Snowflake,
}