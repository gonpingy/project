var
  CONFIG = require('./constant.js'),
  DB = require('../../lib/db.js'),
  fs = require('fs'),
  mysql = require('/usr/local/lib/node_modules/mysql/lib/mysql');

var config_sql = []
var sql = 'INSERT INTO train(name, line_id, go_for, date, service, created) VALUES(?, (SELECT id FROM line WHERE name=?), ?, ?, ?, now())';


var import_train = function(lineDir) {
  console.info('Line: ' + lineDir);
  stationList = JSON.parse(fs.readFileSync(lineDir + '/stationList.html.json'));

  config_sql = [];
  var train = {}; 

  // 駅数分ループ
  for (var station in stationList.station) {
    console.log(lineDir + '/' + station + '/timetableList.html.json');
    var timetableList = JSON.parse(fs.readFileSync(lineDir + '/' + station + '/timetableList.html.json'));

    // 時刻表数分ループ
    for (var type in timetableList.timetable) {
      console.log(lineDir + '/' + station + '/' + type + '.html.json');
      var
        timetable = JSON.parse(fs.readFileSync(lineDir + '/' + station + '/' + type + '.html.json')),
      i = 0;
        goFor = timetable.for,
        date = timetable.kind;

      // 初めて存在する行き先の場合
      if (train[goFor] == undefined) {
        train[goFor] = {};
        train[goFor][date] = {};
      // 初めて存在する日にちの場合
      } else if (train[goFor][date] == undefined) {
        train[goFor][date] = {};
      }

      // 時間数分ループ
      for (var hour in timetable.timetable) {
        // 分数分ループ
        for (index in timetable.timetable[hour]) {
          var time = timetable.timetable[hour][index];

          // 初めて存在する行き先の場合
          if (train[goFor][date][time.for] == undefined) {
            train[goFor][date][time.for] = {}
          }

          // 初めて存在する電車種別の場合
          if (train[goFor][date][time.for][time['form']] == undefined) {
            train[goFor][date][time.for][time['form']] = 0;
          } else {
            train[goFor][date][time.for][time['form']]++;
          }
        }
      }
    }
  }

  // 行き先数分ループ
  for (name in train) {
    // 日にち数分ループ
    for (date in train[name]) {
      // 行き先すう分ループ
      for (goFor in train[name][date]) {
        // 列車種別数分ループ
        for (service in train[name][date][goFor]) {
          // 普通列車の場合
          if (service == '') {
            service = '普';
          }
          config_sql.push({
            'sql': sql,
            'parameters': [name, timetable.lineName, goFor, date, service]
          });
          console.log(['@@@', name, timetable.lineName, goFor, date, service].join("\t"));
        }
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
  import_train(process.argv[2]);
} else {
  prefectureList = JSON.parse(fs.readFileSync(CONFIG.HTML_PREFECTURE_LIST + '.json'));
  lineNameList = {};
  prefectureList = {
//    '01': 0,
//    '02': 0,
//    '03': 0,
//    '04': 0,
//    '05': 0,
//    '06': 0,
//    '07': 0,
//    '08': 0,
//    '09': 0,
//    '10': 0,
//    '11': 0,
//    '12': 0,
//    '13': 0,
//    '14': 0,
//    '15': 0,
//    '16': 0,
//    '17': 0,
//    '18': 0,
//    '19': 0,
//    '20': 0,
//    '21': 0,
//    '22': 0,
//    '23': 0,
//    '24': 0,
//    '25': 0,
//    '26': 0,
//    '27': 0,
//    '28': 0,
//    '29': 0,
//    '30': 0,
//    '31': 0,
//    '32': 0,
//    '33': 0,
//    '34': 0,
//    '35': 0,
//    '36': 0,
//    '37': 0,
//    '38': 0,
//    '39': 0,
//    '40': 0,
//    '41': 0,
//    '42': 0,
//    '43': 0,
//    '44': 0,
//    '45': 0,
//    '46': 0,
//    '47': 0
  };

  // 都道府県数分ループ
  for (var id in prefectureList) {
    console.log('prefecture: ' + id);
    var prefDir = CONFIG.DIR_DATA + '/' + id;
    var lineList = JSON.parse(fs.readFileSync(CONFIG.DIR_DATA + '/' + id + '/lineList.html' + '.json'));
  
    // 路線数分ループ
    for (var i in lineList.line) {
      import_train(prefDir + '/' + lineList.line[i].name);
    }
  }
}
