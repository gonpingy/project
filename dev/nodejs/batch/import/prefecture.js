var
  CONFIG = require('./configuration.js'),
  DB = require('../../lib/db.js'),
  fs = require('fs'),
  mysql = require('/usr/local/lib/node_modules/mysql/lib/mysql');

var config_sql = []
var sql = 'INSERT INTO prefecture(id, name, created) VALUES(?, ?, now())';

prefectureList = JSON.parse(fs.readFileSync(CONFIG.HTML_PREFECTURE_LIST + '.json'));

// 都道府県数分ループ
for (var i in prefectureList) {
  config_sql[i] = {
    'sql': sql,
    'parameters': [i, prefectureList[i].name]
  }
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
  console.log('prefectures are imported');
});
