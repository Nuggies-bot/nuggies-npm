/// <reference types="mongoose" />
declare const _exports: {
	connect: typeof import("./classes/v13/main").connect;
	handleInteractions: typeof import("./classes/v13/main").handleInteractions;
	Messages: typeof import("./classes/v13/main").Messages;
	giveaways: typeof import("./classes/v13/giveaways");
	buttonroles: typeof import("./classes/v13/buttonroles");
	dropdownroles: typeof import("./classes/v13/dropdownroles");
	applications: typeof import("./classes/v13/applications");
} | {
	connect: typeof import("./classes/v12/main").connect;
	handleInteractions: typeof import("./classes/v12/main").handleInteractions;
	Messages: typeof import("./classes/v12/main").Messages;
	giveaways: typeof import("./classes/v12/giveaways");
	buttonroles: typeof import("./classes/v12/buttonroles");
	dropdownroles: typeof import("./classes/v12/dropdownroles");
	applications: typeof import("./classes/v12/applications");
};
export = _exports;