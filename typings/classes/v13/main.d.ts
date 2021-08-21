import mongoose = require("mongoose");
/**
    *
    * @param {string} url - MongoDB connection URI.
    */
export function connect(url: string): Promise<typeof mongoose>;
export function handleInteractions(client: any): Promise<void>;
