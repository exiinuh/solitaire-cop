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


async function SetKey(key, value)
{
  await db.set(key, value);    
}

async function GetKeyValue(key)
{
  let value = await db.get(key);
  console.log("||" + key + ": " +　value);
  return value;
}

async function DeleteKey(key)
{
  await db.delete(key);
}

function Show()
{
  db.list().then(
    keys =>
    {
      for (var key of keys)
      {
        GetKeyValue(key);    
      }
    });
}

function Load(jsonFile)
{
  var list = file.GetList("data", jsonFile);
  var fileName = list[0];

  // Read history.json file
  fs.readFile(
    fileName, 
    function(err, data) 
    {      
      // Check for errors
      if (err) 
      {      
        console.log(err);
        throw err;
      }
     
      // Converting to JSON
      let json = JSON.parse(data);

      // Init db
      for(let i = 0; i < json.length; i++) 
      {
        let obj = json[i];

        SetKey(obj["channel_name"], obj["context"]);
      }      
    });
}

module.exports = { Load, Show, SetKey, GetKeyValue };