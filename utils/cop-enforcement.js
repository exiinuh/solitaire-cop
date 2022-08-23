const { pinyin } = require('pinyin-pro');

const database = require("../data/database");

async function Check(answer, channelName) {
  var result;
  const lengthKey = channelName + "_length";
  await database.GetKeyValues([channelName, lengthKey]).then(
    values => {
      //console.log(values);
      const history = values[0];
      const length = values[1];

      if (history === null) {
        history = [];
      }

      if (length == null) {
        // default
        let length = 3;
      }

      // check length
      if (answer.length != length) {
        result = CheckResult.INVALID_LENGTH;
      }
      else
        // check duplication
        if (history.includes(answer)) {
          console.log("duplicate");
          result = CheckResult.DUPLICATE;
        }
        else {
          // check pinyin
          var success = true;
          if (history.length > 0) {
            const lastAnswer = history[history.length - 1];
            const lastWord = lastAnswer[lastAnswer.length - 1];
            const lastWordPinyin = pinyin(
              lastWord,
              {
                toneType: 'none',
                type: 'array',
                multiple: true
              });

            const firstWord = answer[0];
            const firstWordPinyin = pinyin(
              firstWord,
              {
                toneType: 'none',
                type: 'array',
                multiple: true
              });

            console.log(lastWordPinyin);
            console.log(firstWordPinyin);

            const filteredArray = lastWordPinyin.filter(value => firstWordPinyin.includes(value));
            if (filteredArray.length == 0) {
              success = false;
            }
          }

          if (!success) {
            console.log("invalid context");
            result = CheckResult.INVALID_CONTEXT;
          }
          else {
            history.push(answer);
            database.SetKey(channelName, history);

            console.log("success");
            result = CheckResult.SUCCESS;
          }
        }
    });

  return result;
}

async function Revert(answer, channelName) {
  var lastAnswer = "";
  await database.GetKeyValue(channelName)
    .then(
      history => {
        // remove from database
        const index = history.indexOf(answer);
        history.splice(index, 1);
        database.SetKey(channelName, history);

        if (history.length > 0) {
          lastAnswer = history[history.length - 1];
        }
      });

  return lastAnswer;
}

async function SetLength(length, channelName) {
  const lengthKey = channelName + "_length";
  await database.SetKey(lengthKey, length);
}

const CheckResult =
{
  SUCCESS: 0,
  DUPLICATE: 1,
  INVALID_LENGTH: 2,
  INVALID_CONTEXT: 3
}

module.exports = { CheckResult, Check, Revert, SetLength };