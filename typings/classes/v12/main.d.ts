import mongoose = require("mongoose");
import Discord = require("discord.js");
/**
    *
    * @param {string} url - MongoDB connection URI.
    */
export function connect(url: string): Promise<typeof mongoose>;
export function handleInteractions(client: Discord.Client): Promise<void>;
