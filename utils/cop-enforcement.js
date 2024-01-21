const { pinyin } = require('pinyin-pro');

const database = require("../data/database");

async function Check(answer, channelName) {
  var result;

  await database.GetCurrentLength(channelName).then(
    async current_length => {
      if (current_length == null) {
        result = CheckResult.MISSING_LENGTH;
        return result;
      }

      await database.GetHistory(channelName, current_length).then(
        async data => {
          history = [];
          if (data != null) {
            history = data;
          }

          // check length
          if (answer.length != current_length) {
            console.log("wrong length");
            result = CheckResult.INVALID_LENGTH;
          }
          else {
            if (history.length > 0) {
              // check duplication
              if (history.includes(answer)) {
                console.log("duplicate");
                result = CheckResult.DUPLICATE;
              }
              else {
                // check pinyin            
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

                console.log(lastWordPinyin + " " + lastAnswer);
                console.log(firstWordPinyin);

                const filteredArray = lastWordPinyin.filter(value => firstWordPinyin.includes(value));
                if (filteredArray.length != 0) {
                  console.log("success");
                  result = CheckResult.SUCCESS;
                }
                else {
                  console.log("invalid context");
                  result = CheckResult.INVALID_CONTEXT;
                }
              }
            }
            else {
              console.log("success");
              result = CheckResult.SUCCESS;
            }
          }

          if (result == CheckResult.SUCCESS) {
            history.push(answer);
            database.SetHistory(channelName, current_length, history);
          }
        });
    });

  return result;
}

async function Revert(answer, channelName) {
  var lastAnswer = "";

  await database.GetCurrentLength(channelName).then(
    async current_length => {
      if (current_length != null) {
        await database.GetHistory(channelName, current_length).then(
          history => {
            // remove from database
            const index = history.indexOf(answer);
            history.splice(index, 1);
            database.SetHistory(channelName, current_length, history);

            if (history.length > 0) {
              lastAnswer = history[history.length - 1];
            }
          });
      }
    });

  return lastAnswer;
}

async function SetLength(length, channelName) {
  await database.SetCurrentLength(channelName, length);
}

async function Clear(channelName) {
  await database.Clear(channelName);
}

const CheckResult =
{
  SUCCESS: 0,
  DUPLICATE: 1,
  INVALID_LENGTH: 2,
  INVALID_CONTEXT: 3,
  MISSING_LENGTH: 4
}

module.exports = { CheckResult, Check, Revert, SetLength, Clear };