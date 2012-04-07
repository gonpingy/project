var
  CONSTANT = require('./constant.js'),
  Importer = require('/Users/gonpingy/project/dev/nodejs/batch/import/ekikara/importer.js'),
  fs = require('fs'),
  util = require('util');

/**
 * コンストラクタ
 * @constructor
 */
var StationImporter = function() {
  Importer.call(this);
};

module.exports = StationImporter;

// Importerを継承
util.inherits(StationImporter, Importer);

/**
 * 処理実行後のコールバック関数　
 */
StationImporter.prototype.executed = function() {
  console.log('stations are imported.');
};

/**
 * 路線ごとの設定
 *
 * @param {String} 路線ID
 * @return void
 */
StationImporter.prototype.setConfigByLineId = function(lineId) {
  var
    line = JSON.parse(require('fs').readFileSync(CONSTANT.DIR_LINE + '/' + lineId + '/line.html.json')),
    sql = 'INSERT INTO ' +
            'station ' +
          '( ' +
            'ekikara_id, ' +
            'name, ' +
            'prefecture_id, ' +
            'created ' +
          ') ' +
          'VALUES( ' +
            '?, ' +
            '?, ' +
            '(SELECT id FROM prefecture WHERE name=?), ' +
            'now() ' +
          ')';

  // 駅数分ループ
  for (var stationId in line.station) {
    this.config.push({
      'sql': sql,
      'parameters': [line.station[stationId].id, line.station[stationId].name, line.station[stationId].pref.replace(/^(.*)・.*$/, '$1')]
    });
  }
};

// インポート実行
importer = new StationImporter();
importer.execute();
