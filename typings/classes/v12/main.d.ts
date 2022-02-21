import mongoose = require("mongoose");
import Discord = require("discord.js");

export function Messages(client: Discord.Client, options: {
    giveawayOptions?: GiveawayMessageOptions;
    buttonRolesOptions?: ButtonrolesMessageOptions;
    dropdownRolesOptions?: DropdownrolesMessageOptions;
}): Promise<void>;


export function connect(url: string): Promise<typeof mongoose>;
export function handleInteractions(client: Discord.Client): Promise<void>;

declare interface GiveawayMessageOptions {
	dmWinner: boolean,
	dmHost: boolean,
	giveaway: string,
	giveawayDescription: string,
	endedGiveawayDescription: string,
	giveawayFooterImage: string,
	winMessage: string,
	rerolledMessages: string,
	toParticipate: string,
	newPartcipant: string,
	alreadyParticipated: string,
	noParticipants: string,
	noRole: string,
	dmMessage: string,
	noWinner: string,
	alreadyEnded: string,
	dropWin: string,
}

declare interface ButtonrolesMessageOptions {
	addMessage: string,
	removeMessage: string,
}

declare interface DropdownrolesMessageOptions {
	addMessage: string,
	removeMessage: string,
}