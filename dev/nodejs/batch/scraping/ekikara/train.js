var
  CONSTANT = require('./constant.js'),
  Generator = require('/Users/gonpingy/project/dev/nodejs/batch/scraping/ekikara/generator.js'),
  util = require('util');

/**
 * コンストラクタ
 * @constructor
 */
var TrainGenerator = function() {
  Generator.call(this);
}

module.exports = TrainGenerator;

// Generatorを継承
util.inherits(TrainGenerator, Generator);

/**
 * スクレイピング実行後のコールバック関数　
 */
TrainGenerator.prototype.executed = function() {
  console.log('train list are generated.');
}

/**
 * 電車スクレイピング
 *
 * @param {Object} errors
 * @param {Object} window
 */
TrainGenerator.prototype.scraping = function(errors, window) {
  var
    $ = window.$,
    baseUrl  = 'http://ekikara.jp/newdata',
    feed = {
      'train': {
      },
      'route': [
      ]
    };

  // 0: 列車名
  // 1: 列車番号
  // 2: 列車予約コード
  // 3: 連結車両
  // 4: 備考
  // 5: 運転日
  // 7: タイトル行
  // 8: 空行
  // 9-ラスト-1: 駅
  // ラスト: 空行
  feed['train']['name'] = $('td.lowBg01 tr:eq(0) td.lowBgFFF').text().replace(/^\s+|\s+$/g, '');
  feed['train']['no'] = $('td.lowBg01 tr:eq(1) td.lowBgFFF').text().replace(/^\s+|\s+$/g, '');
  feed['train']['reserve'] = $('td.lowBg01 tr:eq(2) td.lowBgFFF').text().replace(/^\s+|\s+$/g, '');
  feed['train']['connection'] = $('td.lowBg01 tr:eq(3) td.lowBgFFF').text().replace(/^\s+|\s+$/g, '');
  feed['train']['note'] = $('td.lowBg01 tr:eq(4) td.lowBgFFF').text().replace(/^\s+|\s+$/g, '');
  feed['train']['day'] = $('td.lowBg01 tr:eq(5) td.lowBgFFF').text().replace(/^\s+|\s+$/g, '');
  $('td.lowBg01 tr td span a').each(function() {
    var station = $(this).parent().parent().parent();
    time = station.next().find('span');
    platform = station.next().next();

    arrive = time.eq(0).text().replace(/^\s+|\s+$/g, '') == '' ? '' : time.eq(0).text().replace(/^\s+|\s+$/g, '').substring(0,5);
    depart = time.eq(1).text().replace(/^\s+|\s+$/g, '') == '' ? '' : time.eq(1).text().replace(/^\s+|\s+$/g, '').substring(0,5);
    stationId = this.href.split('/').pop().substring(0, 8);

    feed['route'].push({
      'id': stationId,
      'arrive': arrive,
      'depart': depart,
      'name': this.innerHTML,
      'platform': platform.text().replace(/^\s+|\s+$/g, '')
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
TrainGenerator.prototype.setConfigByLineId = function(lineId) {
  var 
    day = ['holiday', 'saturday', 'weekday'],
    line = JSON.parse(require('fs').readFileSync(CONSTANT.DIR_LINE + '/' + lineId + '/line.html.json'));

  // 行き先数分ループ
  for (var track in line['line']['track']) {
    for (var i in day) {
      trackList = JSON.parse(require('fs').readFileSync(CONSTANT.DIR_LINE + '/' + lineId + '/' + track + '/' + day[i] + '/trackList.html.json'));

      for (var j in trackList['track']) {
        trainList = JSON.parse(require('fs').readFileSync(CONSTANT.DIR_LINE + '/' + lineId + '/' + track + '/' + day[i] + '/' + j + '.html.json'));

        // 電車数分ループ
        for (var k in trainList['train']) {
          this.setConfigHtml(CONSTANT.DIR_LINE + '/' + lineId + '/train/' + trainList['train'][k]['id'] + '.html');
        }
      }
    }
  }
}

generator = new TrainGenerator();
generator.execute();
