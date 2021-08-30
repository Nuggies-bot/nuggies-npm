export = DropdownRoles;
declare class DropdownRoles {
    /**
 *
 * @param {Message} message - The Discord Message
 * @param {String} content - The Discord send data, can be an embed or string
 * @param {String} role - The role ID of the role
 * @param {String} channelID - The channel ID that will be recieving the dropdown
 */
    static create(options: DropdownRolesCreateOptions): Promise<void>;
    roles: Discord.Snowflake[];
    /**
     *
     * @param {String} label - dropdown label
     * @param {String} emoji - The emoji id [optional]
     * @param {String} role - The role id
     */
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
	message: Discord.Message,
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