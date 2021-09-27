export = dropdownroles;
declare class dropdownroles {
    static create(client: Discord.Client, options: DropdownRolesCreateOptions): Promise<void>;

    roles: Discord.Snowflake[];

    addrole(options: RolesOptions): dropdownroles;

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
	role: dropdownroles,
}