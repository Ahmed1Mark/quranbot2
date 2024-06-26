
import { Database } from 'st.db';
import inquirer from "inquirer";
import startBot from "./bot.js";
import { Interval } from 'quickinterval';
import { Database as ReplitDB } from "quick.replit";
const is_replit = process.env.REPL_ID && process.env.REPL_SLUG && process.env.REPL_OWNER;
const shuruhatik = `█▀ █░█ █░█ █▀█ █░█ █░█ ▄▀█ ▀█▀ █ █▄▀\n▄█ █▀█ █▄█ █▀▄ █▄█ █▀█ █▀█ ░█░ █ █░█`
const settings = new Database("./config.yml");
const config = is_replit && settings.has("token") ? settings : is_replit ? new ReplitDB() : settings;

async function runAction(auto_run) {
  console.clear()
  if (await settings.has("reset") && await config.has("token")) {
    if (auto_run) return await startBot(await settings.get("debug") || false, config, settings);
    const { action } = await inquirer.prompt({
      name: "action",
      type: 'list',
      message: `What is the action you want to do?`,
      choices: [
        { name: "Run the bot", value: 0 }, { name: "Run the bot with debug mode", value: 1 }, { name: "Re-setup to put a new token and information", value: 2 }
      ]
    })

    if (action == 0) {
      await settings.set("debug", action);
      return await startBot(false, config, settings);
    } else if (action == 1) {
      await settings.set("debug", action);
      return await startBot(true, config, settings);
    };
  } else {
    console.log(`\nDeveloped By \u001b[32;1mShuruhatik#2443\u001b[0m `)
    await config.delete(`token`);
    const { waiting_time, token_bot, status_type, status_bot } = await inquirer.prompt([
      {
        name: "token_bot",
        mask: "#",
        type: 'password',
        prefix: "\u001b[32;1m1-\u001b[0m",
        message: `Put your Bot token :`,
        mask: "*"
      }, {
        name: "status_bot",
        type: 'input',
        prefix: "\u001b[32;1m2-\u001b[0m",
        message: `Type in the status of the bot you want :`
      }, {
        name: "status_type",
        type: 'rawlist',
        prefix: "\u001b[32;1m3-\u001b[0m",
        message: `Choose the type of bot status :`,
        choices: [
          { name: "Playing", value: 0 }, { name: "Listening", value: 2 }, { name: "Watching", value: 3 }, { name: "Competing", value: 5 }
        ]
      }
    ]);
    await config.set(`token`, clearTextPrompt(token_bot));
    await settings.set("status_bot", clearTextPrompt(status_bot, true));
    await settings.set("status_type", status_type);
    await settings.set("reset", "احذف هذا السطر إذا كنت تريد تحط توكن جديد");
    return await runAction();
  };
};

function sendDM(member, content, file) {
  return new Promise((resolve, reject) => {
    (member.user || member).getDMChannel().then(channel => {
      channel.createMessage(content, file).then(resolve).catch(reject);
    }).catch(reject);
  });
};

function clearTextPrompt(str, status_bot = false) {
  return !status_bot ? str.trim().replaceAll("\\", "").replaceAll(" ", "").replaceAll("~", "") : str.trim().replaceAll("\\", "").replaceAll("~", "")
}
function getRandomNumber(length, excludedNumbers) {
  if (excludedNumbers === void 0) { excludedNumbers = []; }
  var number = 0;
  do {
    number = Math.floor(Math.random() * length) + 1;
  } while (excludedNumbers.includes(number));
  return number;
}
async function startProject() {
  let timeEnd = await settings.has("reset") && await config.has("token") ? 200 : 3000
  new Interval(async (int) => {
    process.stdout.write('\x1Bc');
    process.stdout.write(`\r\u001b[38;5;${getRandomNumber(230)}m${shuruhatik}\u001b[0m\n\n\u001b[1mﻲﺒﻨﻟﺍ ﻰﻠﻋ ةﻼﺻﻭ رﺎﻔﻐﺘﺳﻻﺍ ﺮﺜﻛﻭ ،ﻪﻠﻟﺍ ﺮﻛﺫ َﺲﻨﺗ ﻻ\u001b[0m`);
    if (int.elapsedTime >= timeEnd) {
      int.pause();
      await runAction(true);
    }
  }, 100).start();
}

export { startProject, shuruhatik }