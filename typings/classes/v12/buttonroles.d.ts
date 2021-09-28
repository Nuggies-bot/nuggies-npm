export = ButtonRoles;
declare class ButtonRoles {
    static create(client: Discord.Client, options: ButtonRolesCreateOptions): Discord.Message;

    static edit(options: ButtonRolesEditOptions): Discord.Message;

    static delete(message: Discord.Message): void;

    roles: any[];

    addrole(options: ButtonRolesOptions): ButtonRoles;

    toJSON(): {
        roles: Discord.Snowflake[];
    };
}
import Discord = require("discord.js");
import buttons = require("discord-buttons");

declare interface RolesOptions {
	label: string,
	emoji: Discord.EmojiResolvable,
	role: Discord.Snowflake,
}

declare interface ButtonRolesOptions extends RolesOptions {
	color: buttons.MessageButtonStyle,
}

declare interface RolesCreateOptions {
	content: Discord.MessageEmbed | string,
	channelID: Discord.Snowflake,
}

declare interface ButtonRolesCreateOptions extends RolesCreateOptions {
	role: ButtonRoles,
}

declare interface RolesEditOptions {
	message: Discord.Message,
	content: Discord.MessageEmbed | string,
}

declare interface ButtonRolesEditOptions extends RolesEditOptions {
	role: ButtonRoles,
}