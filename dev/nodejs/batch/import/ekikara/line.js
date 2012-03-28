var
  CONSTANT = require('./constant.js'),
  Importer = require('/Users/gonpingy/project/dev/nodejs/batch/import/ekikara/importer.js'),
  fs = require('fs'),
  util = require('util');

/**
 * コンストラクタ
 * @constructor
 */
var LineImporter = function() {
  Importer.call(this);
};

module.exports = LineImporter;

// Importerを継承
util.inherits(LineImporter, Importer);

/**
 * 処理実行後のコールバック関数　
 */
LineImporter.prototype.executed = function() {
  console.log('lines are imported.');
};

/**
 * 路線ごとの設定
 *
 * @param {String} 路線ID
 * @return void
 */
LineImporter.prototype.setConfigByLineId = function(lineId) {
  var
    line = JSON.parse(require('fs').readFileSync(CONSTANT.DIR_LINE + '/' + lineId + '/line.html.json')),
    sql = 'INSERT INTO line(ekikara_id, name, created) VALUES(?, ?, now())';

  this.config.push({
    'sql': sql,
    'parameters': [line.line.id, line.line.name]
  });
};

// インポート実行
importer = new LineImporter();
importer.execute();
