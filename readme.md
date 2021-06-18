# NUGGIES

A npm package to manage giveaways easily for Discord Bot Developers

# Installation <img src = "https://cdn.discordapp.com/emojis/763159009686585354.gif?v=1" alt="download" width=40>

npm:
```powershell
npm i nuggies
 ```

yarn:
```powershell
yarn add nuggies
 ```

# Preview <img src = "https://cdn.discordapp.com/emojis/546353169341349888.png?v=1" width = "40">
<img src="MDfiles\test_gaw.png">

 # Usage <img src = "https://cdn.discordapp.com/emojis/837910195450937384.png?v=1" alt = "hmmm" width=40>

## Create

Create is a function which will help you to create giveaways easily. <br><br>
Example code can be found below
 ```js
const Nuggies = require('Nuggies')
        Nuggies.giveaways.connect('MONGO URI');
        Nuggies.giveaways.create({
            message: message,
            prize: 'test',
            host: message.author.id,
            winners: 1,
            endAfter: '10s',
            requirements: { enabled: false },
            channel: message.channel.id,
        });
 ```

 ## End

 End is a function which will help you end giveaways easily <br> <br>

You can simply use this function by writing a line of code.
 ```js
    async () => {   
    await Nuggies.giveaways.end(msg, data, msg);
    }
 ```
## Reroll

 Reroll is a function which will help you reroll giveaways easily <br> <br>


You can simply use this function by writing a line of code.

```js
    async () => {   
    win = await Nuggies.giveaways.reroll(client, args[0]);
    }

```

<!-- dont touch without asking AssassiN#0002 -->