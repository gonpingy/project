var
  CONSTANT = require('./constant.js'),
  Importer = require('/Users/gonpingy/project/dev/nodejs/batch/import/ekikara/importer.js'),
  fs = require('fs'),
  util = require('util');

/**
 * コンストラクタ
 * @constructor
 */
var TrainImporter = function() {
  Importer.call(this);
};

module.exports = TrainImporter;

// Importerを継承
util.inherits(TrainImporter, Importer);

/**
 * 処理実行後のコールバック関数　
 */
TrainImporter.prototype.executed = function() {
  console.log('routes are imported.');
};

/**
 * 路線ごとの設定
 *
 * @param {String} 路線ID
 * @return void
 */
TrainImporter.prototype.setConfigByLineId = function(lineId) {
  var 
    day = ['holiday', 'saturday', 'weekday'],
    date = {'holiday': 4, 'saturday': 2, 'weekday': 1},
    line = JSON.parse(require('fs').readFileSync(CONSTANT.DIR_LINE + '/' + lineId + '/line.html.json')),
    sql = 'INSERT INTO ' +
            'train ' +
          '( ' +
            'ekikara_id, ' +
            'line_id, ' +
            'name, ' +
            'no, ' +
            'reserve, ' +
            'connection, ' +
            'note, ' +
            'date, ' +
            'created ' +
          ') ' +
          'VALUES( ' +
            '?, ' +
            '(SELECT id FROM line WHERE ekikara_id=?), ' +
            '?, ' +
            '?, ' +
            '?, ' +
            '?, ' +
            '?, ' +
            '?, ' +
            'now() ' +
          ')';

  // 行き先数分ループ
  for (var track in line['line']['track']) {
    for (var i in day) {
      trackList = JSON.parse(require('fs').readFileSync(CONSTANT.DIR_LINE + '/' + lineId + '/' + track + '/' + day[i] + '/trackList.html.json'));

      for (var j in trackList['track']) {
        trainList = JSON.parse(require('fs').readFileSync(CONSTANT.DIR_LINE + '/' + lineId + '/' + track + '/' + day[i] + '/' + j + '.html.json'));

        // 電車数分ループ
        for (var k in trainList['train']) {
          trainId = trainList['train'][k]['id'];
          train= JSON.parse(require('fs').readFileSync(CONSTANT.DIR_LINE + '/' + lineId + '/train/' + trainId + '.html.json'));
          this.config.push({
            'sql': sql,
            'parameters': [trainId, lineId, train.train.name, train.train.no, train.train.reserve, train.train.connection, train.train.note, date[day[i]]]
          });
        }
      }
    }
  }
};

// インポート実行
importer = new TrainImporter();
importer.execute();
