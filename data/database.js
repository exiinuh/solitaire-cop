const fs = require('fs');
const file = require("../utils/file");

const replit_database = require("@replit/database");
const db = new replit_database();

// var fs=require('fs');
// var data=fs.readFileSync('words.json', 'utf8');
// var words=JSON.parse(data);
// var bodyparser=require('body-parser');
// console.log(words);
// var express=require('express');

// var app=express();

// var server=app.listen(3030,listening);

// function listening(){
// console.log("listening..");
// }
// app.use(express.static('website'));
// app.use(bodyparser.urlencoded({extended:false}));
// app.use(bodyparser.json());


async function SetKey(key, value) {
  await db.set(key, value);
}

async function DeleteKey(key) {
  await db.delete(key);
}

async function GetKeyValue(key) {
  let value = await db.get(key);
  //console.log("||" + key + ": " +　value);
  return value;
}

async function GetKeyValues(keys) {
  const promises = [];
  for (var key of keys) {
    promises.push(GetKeyValue(key));
  }

  return await Promise.all(promises);
}

async function GetPair(key) {
  let value = await db.get(key);
  return [key, value];
}

function Show() {
  db.list().then(
    keys => {
      const promises = [];
      for (var key of keys) {
        // let promise = new Promise(
        //   resolve =>
        //   {
        //     GetKeyValue(key).then(
        //       value =>
        //       {
        //         resolve([key, value]);
        //       });
        //   });

        promises.push(GetPair(key));
      }

      Promise.all(promises).then(
        results => {
          for (var history of results) {
            const channel_name = history[0];
            const context = history[1];
            //console.log(channel_name + "\n" + context);
          }
        });
    });

  // db.list().then(
  //   keys =>
  //   {
  //     for (var key of keys)
  //     {
  //       GetKeyValue(key);    
  //     }
  //   });
}

function Load(jsonFile) {
  var list = file.GetList("data", jsonFile);
  var fileName = list[0];

  // Read history.json file
  fs.readFile(
    fileName,
    function(err, data) {
      // Check for errors
      if (err) {
        console.log(err);
        throw err;
      }

      // Converting to JSON
      let json = JSON.parse(data);

      // Init db
      history = json["history"];
      for (let i = 0; i < history.length; i++) {
        let obj = history[i];

        console.log(obj);
        SetKey(obj["channel_name"], obj["context"]);
      }

      console.log(jsonFile + " loaded.");
    });
}

function Dump(jsonFile) {
  db.list().then(
    keys => {
      const promises = [];
      for (var key of keys) {
        promises.push(GetPair(key));
      }

      Promise.all(promises).then(
        results => {
          var jsonObj =
          {
            history: []
          };

          for (var history of results) {
            jsonObj.history.push(
              {
                channel_name: history[0],
                context: history[1]
              });
          }

          var json = JSON.stringify(jsonObj, null, "\t");
          console.log(json);
          // won't persist due to security issue
          //   fs.writeFile(
          //     jsonFile, json, 'utf8', 
          //     function(err, data)
          //     {
          //       if(err)
          //       {
          //         console.log(err);
          //       }
          //       console.log("File dumped.");
          //     });
        });
    });
}

module.exports = { Load, Dump, Show, SetKey, GetKeyValue, GetKeyValues };