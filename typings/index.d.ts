/// <reference types="mongoose" />
declare const _exports: {
    connect: (url: string) => Promise<typeof import("mongoose")>;
    handleInteractions: (client: any) => Promise<void>;
    giveaways: typeof import("./classes/v13/giveaways");
    buttonroles: typeof import("./classes/v13/buttonroles");
    dropdownroles: typeof import("./classes/v13/dropdownroles");
    applications: typeof import("./classes/v13/applications");
} | {
    connect: (url: string) => Promise<typeof import("mongoose")>;
    handleInteractions: (client: any) => Promise<void>;
    giveaways: typeof import("./classes/v12/giveaways");
    buttonroles: typeof import("./classes/v12/buttonroles");
    dropdownroles: typeof import("./classes/v12/dropdownroles");
    applications: typeof import("./classes/v12/applications");
};
export = _exports;
