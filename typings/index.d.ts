/// <reference types="mongoose" />
declare const _exports: {
    connect: typeof import("./classes/v13/main").connect;
    handleInteractions: typeof import("./classes/v13/main").handleInteractions;
    giveaways: typeof import("./classes/v13/giveaways");
    buttonroles: typeof import("./classes/v13/buttonroles");
    dropdownroles: typeof import("./classes/v13/dropdownroles");
    applications: typeof import("./classes/v13/applications");
} | {
    connect: typeof import("./classes/v12/main").connect;
    handleInteractions: typeof import("./classes/v12/main").handleInteractions;
    giveaways: typeof import("./classes/v12/giveaways");
    buttonroles: typeof import("./classes/v12/buttonroles");
    dropdownroles: typeof import("./classes/v12/dropdownroles");
    applications: typeof import("./classes/v12/applications");
};
export = _exports;


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

declare interface RolesOptions {
	label: string,
	emoji: Discord.EmojiResolvable,
	role: Discord.Snowflake,
}

declare interface ButtonRolesOptions extends RolesOptions {
	color: Discord.MessageButtonStyle,
}

declare interface RolesCreateOptions {
	message: Discord.Message,
	content: Discord.MessageEmbed | string,
	channelID: Discord.Snowflake,
}

declare interface ButtonRolesCreateOptions extends RolesCreateOptions {
	role: ButtonRoles,
}

declare interface DropdownRolesCreateOptions extends RolesCreateOptions {
	role: DropdownRoles,
}

declare interface RolesEditOptions {
	message: Discord.Message,
	content: Discord.MessageEmbed | string,
}

declare interface ButtonRolesEditOptions extends RolesEditOptions {
	role: ButtonRoles,
}

declare interface DropdownRolesEditOptions extends RolesEditOptions {
	role: DropdownRoles,
}