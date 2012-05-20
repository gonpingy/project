var
  CONSTANT = require('./constant.js'),
  Generator = require('/Users/gonpingy/project/dev/nodejs/batch/scraping/ekikara/generator.js'),
  util = require('util');

/**
 * コンストラクタ
 * @constructor
 */
var LineGenerator = function() {
  Generator.call(this);
}

module.exports = LineGenerator;

// Generatorを継承
util.inherits(LineGenerator, Generator);

/**
 * スクレイピング実行後のコールバック関数　
 */
LineGenerator.prototype.executed = function() {
  console.log('line are generated.');
}

/**
 * 路線スクレイピング
 *
 * @param {Object} errors
 * @param {Object} window
 */
LineGenerator.prototype.scraping = function(errors, window) {
  var
    $ = window.$,
    baseUrl  = 'http://ekikara.jp/newdata/',
    feed = {
      'line': {
          'id': $('td.lowBg14 td.lowBgFFF a').attr('href').substring(8, 15),
          'name': $('td.lowCap01 h1').text(),
          'track': {
          }
      },
      'station': [
      ]
    },
    track = $('td.lowBg14 td.lowBgFFF a'),
    trackText = ['down', 'up'];

  // 上下線
  for (var i = 0; i < 2; i++) {
    // 線がある場合
    if (track.eq(i).text() != '') {
      feed['line']['track'][trackText[i]] = {
        'name': track.eq(i).text().replace(/^(.+)\(.+\)/, '$1'),
        'uri': track.eq(i).attr('href').replace('../', baseUrl)
      }
    }
  }

  // 駅数分ループ
  $('td.lowBg01 td.lowBg06 span.l a').each(function() {
    var a = $(this);
    var stationId = a.attr('href').substring(11, 19);

    feed['station'].push({
      'id': stationId,
      'name': a.find('span').text().replace(/^(.*)\(.*$/, '$1'),
      'furigana': a.parent().html().replace(/^.+\<br\>(.+)$/, '$1'),
      'pref': a.find('span').text().replace(/^(.*)\((.*)\)$/, '$2'),
      'uri': a.attr('href').replace('../', baseUrl)
    });
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
LineGenerator.prototype.setConfigByLineId = function(lineId) {
  this.setConfigHtml(CONSTANT.DIR_LINE + '/' + lineId + '/line.html');
}

generator = new LineGenerator();
generator.execute();
