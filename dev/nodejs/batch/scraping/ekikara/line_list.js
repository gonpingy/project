var
  CONSTANT = require('./constant.js'),
  Generator = require('/Users/gonpingy/project/dev/nodejs/batch/scraping/ekikara/generator.js'),
  util = require('util');

/**
 * コンストラクタ
 * @param {Array} option JSONファイル生成オプション
 * @constructor
 */
var LineListGenerator = function() {
  Generator.call(this);
}

module.exports = LineListGenerator;

// Generatorを継承
util.inherits(LineListGenerator, Generator);

/**
 * スクレイピング実行後のコールバック関数　
 */
LineListGenerator.prototype.executed = function() {
  console.log('prefecture list are generated.');
}

/**
 * 路線一覧スクレイピング
 *
 * @param {Object} errors
 * @param {Object} window
 */
LineListGenerator.prototype.scraping = function(errors, window) {
  var
    $ = window.$,
    extension = '.htm',
    feed = {
      'line': {},
      'pref': {
          'name': $('td.lowCap01 h1').text(),
          'id': ''
      }
    },
    baseUrlLine = 'http://ekikara.jp/newdata/line';

  // 路線数分ループ
  $('div.rsltSet01 span a').each(function() {
    var line_id = $(this).attr('href').replace(/^.*line\/(.*)\.htm$/, '$1');
    feed['line'][line_id] = {
      'name': $(this).text().replace(/^(.*)\(.*\)$/, '$1'),
      'id': line_id,
      'uri': baseUrlLine + '/' + line_id + extension
    };
  });

  // HTML内のコメントからスクレイピング設定のインデックスを抽出
  self.executed($('body').get(0).lastChild.nodeValue, feed);
}

/**
 * 都道府県ごとの設定
 *
 * @param {string} 都道府県ID
 * @return {void}
 */
LineListGenerator.prototype.setConfigByPrefectureId = function(prefectureId) {
  this.setConfigHtml(CONSTANT.DIR_PREFECTURE + '/' + prefectureId + '.html');
}

generator = new LineListGenerator();
generator.execute();
