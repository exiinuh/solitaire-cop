const fs = require('fs');
const path = require('path');

function GetList(folder, end)
{
  const dirPath = path.join(__dirname, '..', folder);
  var list = fs.readdirSync(dirPath).filter(file => file.endsWith(end));
  var fullList = [];
  list.forEach(
    file => fullList.push(path.join(dirPath, file))
    );
  return fullList;
}

module.exports = { GetList };