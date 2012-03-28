var
  CONSTANT = require('./constant.js'),
  Importer = require('/Users/gonpingy/project/dev/nodejs/batch/import/ekikara/importer.js'),
  fs = require('fs'),
  util = require('util');

/**
 * コンストラクタ
 * @constructor
 */
var PrefectureImporter = function() {
  Importer.call(this);
};

module.exports = PrefectureImporter;

// Importerを継承
util.inherits(PrefectureImporter, Importer);

/**
 * 処理実行後のコールバック関数　
 */
PrefectureImporter.prototype.executed = function() {
  console.log('prefectures are imported.');
};

/**
 * 都道府県ごとの設定
 *
 * @param {String} 都道府県ID
 * @return void
 */
PrefectureImporter.prototype.setConfigByPrefectureId = function(prefectureId) {
  var sql = 'INSERT INTO prefecture(id, name, created) VALUES(?, ?, now())';

  console.log(CONSTANT.DIR_PREFECTURE + '/' + prefectureId + '.html.json');
  prefecture = JSON.parse(require('fs').readFileSync(CONSTANT.DIR_PREFECTURE + '/' + prefectureId + '.html.json'));
  
  this.config.push({
    'sql': sql,
    'parameters': [prefectureId, prefecture.pref.name]
  });
};

// インポート実行
importer = new PrefectureImporter();
importer.execute();
