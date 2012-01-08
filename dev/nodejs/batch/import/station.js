var
  conf = require('./configuration.js'),
  DB = require('../../lib/db.js'),
  fs = require('fs'),
  mysql = require('/usr/local/lib/node_modules/mysql/lib/mysql');

var insertStation = function(geo) {
  client.query('INSERT INTO station(name, prefecture_id, line_id, latlng, address) VALUES(?, ?, ?, GeomFromText(?), ?)', [], function(err, fields) {
  });
}

dir = '/Users/gonpingy/Dropbox/Daikonactor/temp/yolp_prefecture/';
prefectureDirList = fs.readdirSync(dir);

var config_sql = []
var sql = 'INSERT INTO station(name, prefecture_id, line_id, latlng, address) VALUES(?, ?, ?, GeomFromText(?), ?)';

for (var i in prefectureDirList) {
  lineDirList = fs.readdirSync(dir + prefectureDirList[i]);

  for (var j in lineDirList) {
    stationList = fs.readdirSync(dir + prefectureDirList[i] + '/' + lineDirList[j]);

    for (var k in stationList) {
      file = dir + prefectureDirList[i] + '/' + lineDirList[j] + '/' + stationList[k];
      geo = JSON.parse(fs.readFileSync(file));

      if (geo['ResultInfo']['Total'] == 1) {
        config_sql.push({
          'sql': sql,
          'parameters': [geo['Feature'][0]['Name'], 1, 1, 'POINT(' + geo['Feature'][0]['Geometry']['Coordinates'].replace(',', ' ') + ')', geo['Feature'][0]['Property']['Address']]
        });
      } else if (geo.ResultInfo.Total > 1) {
        for (var l in geo['Feature']) {
          // 初めに駅が入っているものをDBに追加
          if (geo['Feature'][l]['Name'].indexOf('駅') > 0) {
            break;
          }
        }

        console.log('total > 1: %s', file);

        config_sql.push({
          'sql': sql,
          'parameters': [geo['Feature'][l]['Name'], 1, 1, 'POINT(' + geo['Feature'][l]['Geometry']['Coordinates'].replace(',', ' ') + ')', geo['Feature'][l]['Property']['Address']]
        });
      } else {
        console.log('total = 0: %s', file);
      }
    }
  }
}

var config_db = {
  'database': conf.MYSQL_DATABASE,
  'host': conf.MYSQL_HOST,
  'password': conf.MYSQL_PASSWORD,
  'user': conf.MYSQL_USER,
};

db = new DB(config_db, config_sql);
db.execute();
db.on('executed', function() {
});
