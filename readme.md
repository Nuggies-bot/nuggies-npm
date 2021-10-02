# Nuggies

[![discordBadge](https://img.shields.io/badge/Chat-Click%20here-7289d9?style=for-the-badge&logo=discord)](https://discord.gg/X8v22CPwFN)
[![downloadsBadge](https://img.shields.io/npm/dt/nuggies?style=for-the-badge)](https://npmjs.com/nuggies)
[![versionBadge](https://img.shields.io/npm/v/nuggies?style=for-the-badge)](https://npmjs.com/nuggies)
[![documentationBadge](https://img.shields.io/badge/Documentation-Click%20here-blue?style=for-the-badge)](https://nuggies.js.org)


<div align="left">
  <p>
    <a href="https://nodei.co/npm/nuggies
/"><img src="https://nodei.co/npm/nuggies.png?downloads=true&stars=true" alt="NPM Info" /></a>
  </p>
</div>

An Utility Package For Discord Bots!

# 📂・Installation
```powershell
npm i nuggies
```

# 🖥️・Setup
```js
const Discord = require('discord.js');
const client = new Discord.Client();
const Nuggies = require('nuggies');
Nuggies.connect("MONGODB_CONNECTION_URL");
Nuggies.handleInteractions(client);
Nuggies.Messages(client, {}); // full customization

```
# 💡・Features
- Full slash command support!
- Customizability at your fingertips!
- [Giveaways](https://github.com/Nuggies-bot/giveaways-example)
- [Dropdown Roles](https://github.com/Nuggies-bot/dropdown-roles-example)
- [Button Roles](https://github.com/Nuggies-bot/buttonroles-example)
- [Applications](https://github.com/Nuggies-bot/applications-example)

<br>

# 👥・Contact Us

### If You Have Any Problems You Can Join Our [Discord Server](https://discord.gg/X8v22CPwFN).
### Documentation Can Be Found [Here](https://nuggies.js.org).
### Bugs/Suggestions Can Be Submitted [Here](https://github.com/Nuggies-bot/nuggies-npm/issues/new/choose)

<br>

# 👮・License
Nuggies npm licensed under the terms of [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International](https://github.com/Nuggies-bot/nuggies-npm/blob/main/license) ("CC-BY-NC-SA-4.0"). Commercial use is not allowed under this license. This includes any kind of revenue made with or based upon the software, even donations.

The CC-BY-NC-SA-4.0 allows you to:
- [x] **Share** -- copy and redistribute the material in any medium or format
- [x] **Adapt** -- remix, transform, and build upon the material

Under the following terms:
- **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
- **NonCommercial** — You may not use the material for commercial purposes. 
- **ShareAlike** — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.

More information can be found [here](https://creativecommons.org/licenses/by-nc-sa/4.0/).
