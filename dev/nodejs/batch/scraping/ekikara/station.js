var
  CONSTANT = require('./constant.js'),
  Generator = require('/Users/gonpingy/project/dev/nodejs/batch/scraping/ekikara/generator.js'),
  util = require('util');

/*
 * コンストラクタ
 * @constructor
 */
var StationGenerator = function() {
  Generator.call(this);
};

module.exports = StationGenerator;

// Generatorを継承
util.inherits(StationGenerator, Generator);

/**
 * スクレイピング実行後のコールバック関数　
 */
StationGenerator.prototype.executed = function() {
  console.log('station is generated.');
};

/**
 * 駅スクレイピング
 *
 * @param {Object} errors
 * @param {Object} window
 */
StationGenerator.prototype.scraping = function(errors, window) {
  var
    $ = window.$,
    baseUrl  = 'http://ekikara.jp/newdata/',
    feed = {
      'station': {
        'id': $('td.lowBg10 td:eq(2) a').attr('href').replace(/.+_([0-9]+).htm$/g, '$1'),
        'name': $('td.lowCap01 h1' ).text().replace(/^(.*)駅\(.*$/, '$1'),
        'pref': $('td.lowCap01 h1' ).text().replace(/^(.*)\((.*)\)$/, '$2'),
        'uri': baseUrl + $('td.lowBg10 td:eq(2) a').attr('href').replace(/.+_([0-9]+).htm$/g, 'station/$1.htm')
      },
      'line': {
      }
    },
    line;

  // 駅数分ループ
  $('td.lowBg01 td.lowBg06 span.l a').each(function() {
    line = $(this);
    lineId = line.attr('href').replace(/\.\.\/line\/([0-9]+).htm$/, '$1');

    feed.line[lineId] = {
      'id': lineId,
      'name': line.find('span').text(),
      'uri': baseUrl + 'line/' + lineId + '.htm',
    };
  });

  // HTML内のコメントからスクレイピング設定のインデックスを抽出
  self.executed($('body').get(0).lastChild.nodeValue, feed);
};

/**
 * 路線ごとの設定
 *
 * @param {string} 路線ID
 * @return {void}
 */
StationGenerator.prototype.setConfigByLineId = function(lineId) {
  try {
    var line = JSON.parse(require('fs').readFileSync(CONSTANT.DIR_LINE + '/' + lineId + '/line.html.json'));

    // 駅数分ループ
    for (var stationId in line.station) {
        this.setConfigHtml(CONSTANT.DIR_STATION + '/' + stationId + '.html');
    }
  } catch (error) {
    console.error('setConfigByLineId: %s', lineId);
  }
};

generator = new StationGenerator();
generator.execute();
