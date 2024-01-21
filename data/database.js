const fs = require('fs');
const file = require("../utils/file");
const { JsonDB, Config } = require('node-json-db')

var db = new JsonDB(new Config("data/history-database", true, true, '/'));

//const replit_database = require("@replit/database");
//const db = new replit_database();

async function GetCurrentLength(channelName) {
  let data = await GetData("/" + channelName + "/" + process.env.CURRENT_LENGTH_KEY);
  return data;
}

async function SetCurrentLength(channelName, length) {
  Push("/" + channelName + "/" + process.env.CURRENT_LENGTH_KEY, length);
}

async function GetHistory(channelName, length) {
  let data = await GetData("/" + channelName + "/length" + length);
  return data;
}

async function SetHistory(channelName, length, content) {
  await Push("/" + channelName + "/length" + length, content);
}

async function GetData(key) {
  try {
    var data = await db.getData(key);
  } catch (error) {
    console.error(error);
    data = null;
  };

  return data;
}

async function Push(key, value) {
  await db.push(key, value);
}

function Show() {
  // db.list().then(
  //   keys => {
  //     const promises = [];
  //     for (var key of keys) {
  //       promises.push(GetPair(key));
  //     }

  //     Promise.all(promises).then(
  //       results => {
  //         for (var history of results) {
  //           const channel_name = history[0];
  //           const context = history[1];
  //           //console.log(channel_name + "\n" + context);
  //         }
  //       });
  //   });
}

async function Load() {
  await db.load();
  console.log("Database loaded.");
}

async function Clear(channelName) {
  await db.delete("/" + channelName);
}

module.exports = { Load, Clear, GetCurrentLength, SetCurrentLength, GetHistory, SetHistory };