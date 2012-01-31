var
  CONFIG = require('./configuration.js'),
  DB = require('../../lib/db.js'),
  fs = require('fs'),
  mysql = require('/usr/local/lib/node_modules/mysql/lib/mysql');

var config_sql = []
var sql = 'INSERT INTO timetable(station_id, train_id, time, created) VALUES((SELECT id FROM station WHERE name=? AND line_id=(SELECT id FROM line WHERE name=?)), (SELECT id FROM train WHERE line_id=(SELECT id FROM line WHERE name=?) AND name=? AND go_for=? AND date=? AND service=?), ?, now())';


var importTimetable = function(timetableList) {
  console.info('station: ' + timetableList.lineName + ' ' + timetableList.stationName);

  config_sql = [];
  var train = {}; 

  // 時刻表数分ループ
  for (var type in timetableList.timetable) {
    var
      stationName = timetableList.stationName.slice(0, timetableList.stationName.length - 1),
      stationDir = CONFIG.DIR_DATA + '/' + timetableList.prefID + '/' + timetableList.lineName + '/' + stationName,
      timetable = JSON.parse(fs.readFileSync(stationDir + '/' + type + '.html.json'));

    // 時間数分ループ
    for (var hour in timetable.timetable) {
      // 分数分ループ
      for (index in timetable.timetable[hour]) {
        i++;
        if (timetable.timetable[hour][index]['form'] == '') {
          service = '普';
        } else {
          service = timetable.timetable[hour][index]['form'];
        }

        minute = timetable.timetable[hour][index]['time'].substr(2, 2);

        config_sql.push({
          'sql': sql,
          'parameters': [stationName, timetableList.lineName, timetableList.lineName, timetable.for, timetable.timetable[hour][index]['for'], timetable.kind, service, hour + minute + '00']
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
  // インポート実行
  db = new DB(config_db, config_sql);
  db.execute(function() {
    console.log('trains are imported');
  });
}

if (process.argv.length == 3) {
  importTimetable(process.argv[2]);
} else {
  prefectureList = JSON.parse(fs.readFileSync(CONFIG.HTML_PREFECTURE_LIST + '.json'));
  lineNameList = {};
  prefectureList = {
    '13': 0
  };

// 駅ごとの時刻表一覧JSON生成
switch (process.argv.length) {
  case 2:
    begin = 0;
    end = timeTableListList.length;
    break;
  case 3:
    begin = process.argv[2];
    end = timeTableListList.length;
    break;
  case 4:
    begin = process.argv[2];
    end = process.argv[3];
    break;
  default:
    throw new Error('error!');
}
  // 都道府県数分ループ
  for (var id in prefectureList) {
    console.log('prefecture: ' + id);
    var prefDir = CONFIG.DIR_DATA + '/' + id;
    var lineList = JSON.parse(fs.readFileSync(prefDir + '/lineList.html.json'));
  
    // 路線数分ループ
    for (var i in lineList.line) {
      var
        lineDir = prefDir + '/' + lineList.line[i].name,
        stationList = JSON.parse(fs.readFileSync(lineDir + '/stationList.html.json'));
        stationList = JSON.parse(fs.readFileSync('/Users/gonpingy/project/station/13/井の頭線/stationList.html.json'));
        lineDir = '/Users/gonpingy/project/station/13/井の頭線';

        stationNameList = [];
      // 駅数分ループ
      for (var stationName in stationList.station) {
        stationNameList.push(stationName);
      }

      list = stationNameList.slice(begin, end);

      for (var i in list) {
        var
          stationDir = lineDir + '/' + list[i],
          timetableList = JSON.parse(fs.readFileSync(stationDir + '/timetableList.html.json'));

        importTimetable(timetableList);
      }
      break;
    }
  }
}
