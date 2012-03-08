var
  CONFIG = require('./configuration.js'),
  DB = require('../../lib/db.js'),
  fs = require('fs'),
  mysql = require('/usr/local/lib/node_modules/mysql/lib/mysql');

dir = '/Users/gonpingy/Dropbox/Daikonactor/temp/yolp_prefecture/';
prefectureDirList = fs.readdirSync(dir);

var config_sql = []
var sql = 'INSERT INTO station(name, prefecture_id, line_id, latlng, address, created) VALUES(?, ?, (SELECT id FROM line WHERE name=?), GeomFromText(?), ?, now())';

prefectureList = JSON.parse(fs.readFileSync(CONFIG.HTML_PREFECTURE_LIST + '.json'));

// 都道府県数分ループ
for (var id in prefectureList) {
  lineList = JSON.parse(fs.readFileSync(CONFIG.DIR_DATA + '/' + id + '/lineList.html.json'));

  // 路線数分ループ
  for (var i in lineList.line) {
    lineDir = dir + '/' + id + '/' + encodeURI(lineList.line[i].name);
    stationFileList = fs.readdirSync(lineDir);
    stationList = JSON.parse(fs.readFileSync(CONFIG.DIR_DATA + '/' + id + '/' + lineList.line[i].name + '/stationList.html.json'));

    for (var j in stationFileList) {
      file = lineDir + '/' + stationFileList[j];
      geo = JSON.parse(fs.readFileSync(file));

      if (geo['ResultInfo']['Total'] == 1) {
        latlng = 'POINT(' + geo['Feature'][0]['Geometry']['Coordinates'].replace(',', ' ') + ')';
        address = geo['Feature'][0]['Property']['Address'];
      } else if (geo.ResultInfo.Total > 1) {
        for (var l in geo['Feature']) {
          // 初めに駅が入っているものをDBに追加
          if (geo['Feature'][l]['Name'].indexOf('駅') > 0) {
            break;
          }
        }

        console.info('total > 1: %s', file);

        latlng = 'POINT(' + geo['Feature'][l]['Geometry']['Coordinates'].replace(',', ' ') + ')';
        address = geo['Feature'][l]['Property']['Address'];
      } else {
        console.info('total = 0: %s', file);
        latlng = '';
        address = '';
      }

      config_sql.push({
        'sql': sql,
        'parameters': [stationFileList[j].split('.').shift(), id, lineList.line[i].name, latlng, address]
      });
    }
  }
}

var config_db = {
  'database': CONFIG.MYSQL_DATABASE,
  'host': CONFIG.MYSQL_HOST,
  'password': CONFIG.MYSQL_PASSWORD,
  'user': CONFIG.MYSQL_USER
};

db = new DB(config_db, config_sql);
db.execute(function() {
  console.log('stations are imported');
});
