var
  CONFIG = require('./configuration.js'),
  DB = require('../../lib/db.js'),
  fs = require('fs'),
  mysql = require('/usr/local/lib/node_modules/mysql/lib/mysql');

var config_sql = []
var sql = 'INSERT INTO line(name, created) VALUES(?, now())';

prefectureList = JSON.parse(fs.readFileSync(CONFIG.HTML_PREFECTURE_LIST + '.json'));
lineNameList = {};

// 都道府県数分ループ
for (var id in prefectureList) {
  var lineList = JSON.parse(fs.readFileSync(CONFIG.DIR_DATA + '/' + id + '/lineList.html' + '.json'));

  for (var i in lineList.line) {
    lineNameList[lineList.line[i].name] = lineList.line[i].name;
  }
}

for (name in lineNameList) {
  config_sql.push({
    'sql': sql,
    'parameters': [name]
  });
}

var config_db = {
  'database': CONFIG.MYSQL_DATABASE,
  'host': CONFIG.MYSQL_HOST,
  'password': CONFIG.MYSQL_PASSWORD,
  'user': CONFIG.MYSQL_USER
};

// インポート実行
db = new DB(config_db, config_sql);
db.execute(function() {
  console.log('lines are imported');
});
