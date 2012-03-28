var
  CONSTANT = require('./constant.js'),
  Importer = require('/Users/gonpingy/project/dev/nodejs/batch/import/ekikara/importer.js'),
  fs = require('fs'),
  util = require('util');

/**
 * コンストラクタ
 * @constructor
 */
var RouteImporter = function() {
  Importer.call(this);
};

module.exports = RouteImporter;

// Importerを継承
util.inherits(RouteImporter, Importer);

/**
 * 処理実行後のコールバック関数　
 */
RouteImporter.prototype.executed = function() {
  console.log('stations are imported.');
};

/**
 * 路線ごとの設定
 *
 * @param {String} 路線ID
 * @return void
 */
RouteImporter.prototype.setConfigByLineId = function(lineId) {
  var
    line = JSON.parse(require('fs').readFileSync(CONSTANT.DIR_LINE + '/' + lineId + '/line.html.json')),
    stationIdList = [],
    sql = 'INSERT INTO ' +
            'route ' +
          '( ' +
            'station_id, ' +
            'line_id, ' +
            'next_station_id, ' +
            'previous_station_id, ' +
            'created ' +
          ') ' +
          'VALUES( ' +
            '(SELECT id FROM station WHERE ekikara_id=?), ' +
            '(SELECT id FROM line WHERE ekikara_id=?), ' +
            '(SELECT id FROM station WHERE ekikara_id=?), ' +
            '(SELECT id FROM station WHERE ekikara_id=?), ' +
            'now() ' +
          ')';

  // 駅数分ループ
  for (var i in line.station) {
    stationIdList.push(line.station[i].id);
  }

  // 駅数分ループ
  for (var i = 0; i < stationIdList.length; i++) {
    this.config.push({
      'sql': sql,
      'parameters': [stationIdList[i], line.line.id, stationIdList[i + 1], stationIdList[i - 1]]
    });
  }
};

// インポート実行
importer = new RouteImporter();
importer.execute();
