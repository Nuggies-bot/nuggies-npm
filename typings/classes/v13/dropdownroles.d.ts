export = DropdownRoles;
declare class DropdownRoles {

    static create(client: Discord.Client, options: DropdownRolesCreateOptions): Promise<void>;

    roles: Discord.Snowflake[];

    addrole(options: RolesOptions): DropdownRoles;

    toJSON(): {
        roles: Discord.Snowflake[];
    };
}

import Discord = require('discord.js');
declare interface RolesOptions {
	label: string,
	emoji: Discord.EmojiResolvable,
	role: Discord.Snowflake,
}

declare interface RolesCreateOptions {
	content: Discord.MessageEmbed | string,
	channelID: Discord.Snowflake,
}

declare interface DropdownRolesCreateOptions extends RolesCreateOptions {
	role: DropdownRoles,
}

declare interface RolesEditOptions {
	message: Discord.Message,
	content: Discord.MessageEmbed | string,
}

declare interface DropdownRolesEditOptions extends RolesEditOptions {
	role: DropdownRoles,
}