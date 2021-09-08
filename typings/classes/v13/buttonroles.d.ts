declare class ButtonRoles {
    /**
     * @param {Message} message - The Discord Message
     * @param {MessageEmbed} embed - The Discord Embed/Content
     * @param {buttonroles} role - The created object using .buttonroles().addrole()
     * @param {String} channelID - the id of the channel you want to send the message to.
     * @returns {Message} - The message sent
     */
    static create(client: Discord.Client, options: ButtonRolesCreateOptions): Discord.Message;
    /**
     * @param {Message} message - The Discord Message
     * @param {MessageEmbed} embed - The Discord Embed/Content
     * @param {buttonroles} role - The created object using .buttonroles().addrole()
     * @returns {Message} - The message edited
     */
    static edit(options: ButtonRolesEditOptions): Discord.Message;
    /**
     * @param {Message} message - The buttonroles message sent by bot
     */
    static delete(message: Discord.Message): void;
    roles: Discord.Snowflake[];
    /**
     *
     * @param {String} color - Button Color [optional]
     * @param {String} label - Button label
     * @param {String} emoji - The emoji id [optional]
     * @param {String} role - The role id
     */
    addrole(options: ButtonRolesOptions): ButtonRoles;
    toJSON(): {
        roles: Discord.Snowflake[];
    };
}

import Discord = require("discord.js");

declare interface RolesOptions {
	label: string,
	emoji: Discord.EmojiResolvable,
	role: Discord.Snowflake,
}

declare interface ButtonRolesOptions extends RolesOptions {
	color: Discord.MessageButtonStyle,
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