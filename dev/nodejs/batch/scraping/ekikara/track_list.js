var
  CONSTANT = require('./constant.js'),
  Generator = require('/Users/gonpingy/project/dev/nodejs/batch/scraping/ekikara/generator.js'),
  util = require('util');

/**
 * コンストラクタ
 * @param {Array} option JSONファイル生成オプション
 * @constructor
 */
var TrackListGenerator = function() {
  Generator.call(this);
}

module.exports = TrackListGenerator;

// Generatorを継承
util.inherits(TrackListGenerator, Generator);

/**
 * スクレイピング実行後のコールバック関数　
 */
TrackListGenerator.prototype.executed = function() {
  console.log('track list are generated.');
}

/**
 * 行き先一覧スクレイピング
 *
 * @param {Object} errors
 * @param {Object} window
 */
TrackListGenerator.prototype.scraping = function(errors, window) {
  var
    $ = window.$,
    baseUrl  = 'http://ekikara.jp/newdata/line',
    feed = {
      'line': {
          'id': $('td.lowBg14 td.lowBgFFF a:first').attr('href').substring(13, 20),
          'name': $('td.lowCap01 h1').text()
      },
      'track': {
      }
    },
    i = 1;

  // 上下線数分ループ
  $('select option').each(function() {
    feed['track'][i] = {
      'description': this.innerHTML,
      'uri': baseUrl + '/' + feed['line']['id'] + '/' + this.value + '.htm' 
    };
    i++;
  });

  // HTML内のコメントからスクレイピング設定のインデックスを抽出
  self.executed($('body').get(0).lastChild.nodeValue, feed);
}

/**
 * 路線ごとの設定
 *
 * @param {string} 路線ID
 * @return {void}
 */
TrackListGenerator.prototype.setConfigByLineId = function(lineId) {
  try {
    var 
      day = ['holiday', 'saturday', 'weekday'],
      line = JSON.parse(require('fs').readFileSync(CONSTANT.DIR_LINE + '/' + lineId + '/line.html.json'));

    // 行き先数分ループ
    for (var track in line['line']['track']) {
      for (var i in day) {
        this.setConfigHtml(CONSTANT.DIR_LINE + '/' + lineId + '/' + track + '/' + day[i] + '/trackList.html');
      }
    }
  } catch (error) {
    console.error('setConfigByLineId: %s', lineId);
  }
}

generator = new TrackListGenerator();
generator.execute();
