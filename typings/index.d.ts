import mongoose, {
	Document
} from 'mongoose';
import {
	Client, Message, Snowflake, ColorResolvable, MessageEmbed
} from 'discord.js';
import {
	MessageButton, MessageComponent
} from 'discord-buttons';

declare class main {
	public connect(uri: string): Promise<typeof import("mongoose")>;
	public handleInteractions(client: Client): Promise<void>;
}
declare class giveaways {

	Messages(client: Client, options: {
		dmWinner: Boolean,
		giveaway: String,
		giveawayDescription: String,
		endedGiveawayDescription: String,
		giveawayFooterImage: String,
		winMessage: String,
		rerolledMessage: String,
		toParticipate: String,
		newParticipant: String,
		alreadyParticipated: String,
		noParticipants: String,
		noRole: String,
		dmMessage: String,
		noWinner: String,
		alreadyEnded: String,
		dropWin: String,
	}): Promise<void>;

	create({
		message: Message,
		prize: String,
		host: Snowflake,
		winners: Number,
		endAfter: String,
		requirements: Array,
		channel: Snowflake,
	}): Promise<void>;

	startTimer(message: Message, data: Document, instant: Boolean): Promise<void>;

	gotoGiveaway(data: Document): MessageButton;

	endByButton(client: Client, messageID: Snowflake, button: MessageComponent): Promise<void>;

	end(message: Message, data: Document, giveawaymsg: Message): Promise<"ENDED" | "NO_WINNERS">;

	reroll(client: Client, messageID: Snowflake): Promise<Number | Snowflake[]>;

	getByMessageID(messageID: Snowflake): Promise<Document>;

	startAgain(client: Client): Promise<void>;

	drop({
		message: Message,
		channel: Snowflake,
		prize: String,
		host: Snowflake,
	}): Promise<void>;
}
declare class buttonroles {

	addrole({
		color: ColorResolvable,
		label: String,
		emoji: Snowflake,
		role: Snowflake,
	}): Promise<void>

	create({
		message: Message,
		content: MessageEmbed,
		role: Snowflake,
		channelID: Snowflake,
	}): Promise<void>

	edit({
		message: Message,
		content: MessageEmbed,
		role: Snowflake,
	}): Promise<void>

	delete(message: Message): Promise<void>
}

export = main;