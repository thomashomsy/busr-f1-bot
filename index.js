require("dotenv").config();
const Discord = require("discord.js");
const fs = require("fs");
const { google } = require("googleapis");
const { admin } = require("googleapis/build/src/apis/admin");
const readline = require("readline");

const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const role = process.env.ROLE;
const channel = process.env.CHANNEL;
const spreadsheetId = process.env.SHEETID;
const admins = process.env.ADMINS.split(",");
let sheets = null;

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

// Load client secrets from a local file.
fs.readFile("credentials.json", (err, content) => {
  if (err) return console.log("Error loading client secret file:", err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), storeAuth);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

function storeAuth(auth) {
  sheets = google.sheets({ version: "v4", auth });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    //access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err)
        return console.error(
          "Error while trying to retrieve access token",
          err
        );
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

bot.login(TOKEN);
let lastMessage = null;
let race = 0;

bot.on("ready", () => {
  console.info(`\nLogged in as ${bot.user.tag}!`);
  bot.user.setPresence({
    status: "online", //You can show online, idle....
    game: {
      name: "Turn 1 Baku", //The message shown
      type: "WATCHING", //PLAYING: WATCHING: LISTENING: STREAMING:
    },
  });
});

/**
 * The Original Setup for making a check-in system
 */
bot.on("message", async (msg) => {
  if (msg.content.startsWith("!setup")) {
    if (msg.channel.name === channel && admins.includes(msg.author.tag)) {
      const aRole = bot.guilds.array()[0].roles.find((r) => r.name === role);
      const adminRole = bot.guilds
        .array()[0]
        .roles.find((r) => r.name === "F1 Organiser");
      race = msg.content.split("!setup ")[1];

      if (!race) {
        msg.delete();
        return;
      }
      const emoji = bot.emojis.find((emoji) => emoji.name === "BUSR");
      lastMessage = await msg.channel.send(
        emoji +
          " **CHECK-IN IS NOW OPEN FOR RACE WEEK " +
          race +
          "** " +
          //aRole +
          " " +
          emoji +
          " \n\nPlease React with a ✅ if you're planning on participating!" +
          "\n\nIf You're unable to attend after previously checking-in, remove the reaction!\n\nI Will send confirmation of these details!" +
          "\n\nAny issues? Don't hesitate to message an " +
          adminRole +
          " \n\nCheck-in Closes at 6:30PM!"
      );
      lastMessage.react("✅");
      msg.author.send(
        "\n==============================================================\n\nYou have Have Setup Checkin for Race " +
          race
      );
      msg.delete();
    }
  }
});

function error(message) {
  return (
    "\n==============================================================\n\nThere was an issue editing your check in status for race Week: " +
    race +
    "! \nPlease contact @Respects#3394 with error: " +
    message
  );
}

function workOutCell(row, column) {
  const columns = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "AA",
    "AB",
    "AC",
    "AD",
    "AE",
    "AF",
    "AG",
    "AH",
    "AI",
    "AJ",
    "AK",
    "AL",
    "AM",
    "AN",
    "AO",
    "AP",
    "AQ",
    "AR",
    "AS",
    "AT",
    "AU",
    "AV",
    "AW",
    "AX",
    "AY",
    "AZ",
    "BA",
    "BB",
    "BC",
    "BD",
    "BE",
    "BF",
    "BG",
    "BH",
    "BI",
    "BJ",
    "BK",
    "BL",
    "BM",
    "BN",
    "BO",
    "BP",
    "BQ",
    "BR",
    "BS",
    "BT",
    "BU",
    "BV",
    "BW",
    "BX",
    "BY",
    "BZ",
    "CA",
    "CB",
    "CC",
    "CD",
    "CE",
    "CF",
    "CG",
    "CH",
    "CI",
    "CJ",
    "CK",
    "CL",
    "CM",
    "CN",
    "CO",
    "CP",
    "CQ",
    "CR",
    "CS",
    "CT",
    "CU",
    "CV",
    "CW",
    "CX",
    "CY",
    "CZ",
  ];
  return String(columns[column]) + String(row + 1);
}

function checkIn(user, yes = true) {
  if (
    sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Main Sheet!A1:A2",
    })
  ) {
    const defined = {
      spreadsheetId,
      majorDimension: "ROWS",
      range: "Main Sheet!A1:CZ52",
    };
    sheets.spreadsheets.values.get(defined, (err, result) => {
      if (err || !result.data) {
        console.log(err);
        user.send(error("99 - Get Sheet Error"));
        return;
      } else {
        //console.log(result);
        const findName = result.data.values.findIndex(
          (row) => row[2] === user.tag
        ); //Finds the users discord tag
        if (findName === -1) {
          user.send(error("Player Not Found"));
          //get channel
        } else {
          const weekColumn = result.data.values[2]
            .map((column, index) => {
              return { name: column || null, index };
            })
            .filter((column) => column.name === "Checked In")[race - 1].index;
          const cell = workOutCell(findName, weekColumn);
          sheets.spreadsheets.values.update(
            {
              spreadsheetId,
              range: "Main Sheet!" + cell,
              valueInputOption: "RAW",
              resource: { values: [[yes ? "YES" : "NO"]] },
            },
            (err, result) => {
              if (err) {
                user.send(error("95 - Update Failure"));
                console.log(err);
              } else if (yes) {
                console.log(user.tag + " has been checked in!");
                user.send(
                  "\n==============================================================\n\nYou have been successfully checked into the week " +
                    race +
                    " race! \n\nYou should be able to confirm this by seeing your name marked as YES here:\n\nhttps://docs.google.com/spreadsheets/d/" +
                    spreadsheetId +
                    "/"
                );
              } else {
                console.log(user.tag + " has been removed from check in!");
                user.send(
                  "\n==============================================================\n\nYou have been successfully removed from check-in for race week " +
                    race +
                    "! \n\nYou should be able to confirm this by seeing your name marked as NO here:\n\nhttps://docs.google.com/spreadsheets/d/" +
                    spreadsheetId +
                    "/"
                );
              }
            }
          );
        }
      }
    });
  } else {
    user.send(error("101 - Sheet Error"));
  }
}

bot.on("messageReactionAdd", (reaction, user) => {
  if (lastMessage && lastMessage.id === reaction.message.id) {
    console.log("stage 1: " + user.tag);
    if (reaction.emoji.toString().includes("✅")) {
      console.log("Was same emoji");
      //Not self
      if (user.tag !== lastMessage.author.tag) {
        console.log(user.tag + " attempted to check-in!");
        checkIn(user);
      }
    } else {
      reaction.remove();
    }
  }
});

bot.on("messageReactionRemove", (reaction, user) => {
  if (lastMessage && lastMessage.id === reaction.message.id) {
    if (reaction.emoji.toString().includes("✅")) {
      //Not self
      if (user.tag !== lastMessage.author.tag) {
        console.log(user.tag + " attempted to un-check-in!");
        checkIn(user, false);
      }
    }
  }
});
