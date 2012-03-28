var
  CONSTANT = require('./constant.js'),
  Generator = require('/Users/gonpingy/project/dev/nodejs/batch/scraping/ekikara/generator.js'),
  util = require('util');

/**
 * コンストラクタ
 * @constructor
 */
var TrainListGenerator = function() {
  Generator.call(this);
}

module.exports = TrainListGenerator;

// Generatorを継承
util.inherits(TrainListGenerator, Generator);

/**
 * スクレイピング実行後のコールバック関数　
 */
TrainListGenerator.prototype.executed = function() {
  console.log('train list are generated.');
}

/**
 * 行き先一覧スクレイピング
 *
 * @param {Object} errors
 * @param {Object} window
 */
TrainListGenerator.prototype.scraping = function(errors, window) {
  var
    $ = window.$,
    baseUrl  = 'http://ekikara.jp/newdata',
    feed = {
      'line': {
          'day': '', 
          'id': $('td.lowBg14 td.lowBgFFF a:first').attr('href').substring(13, 20),
          'name': $('td.lowCap01 h1').text(),
          'track': $('td.lowBg06').eq(8).find('a').attr('href').indexOf('down') != -1 ? 'down' : 'up'
      },
      'train': []
    };

  // 土曜の場合
  if ($('td.lowBg06').eq(8).find('a').attr('href').indexOf('_sta') != -1) {
    feed['line']['day'] = 'saturday';
  // 休日の場合
  } else if ($('td.lowBg06').eq(8).find('a').attr('href').indexOf('_holi') != -1) {
    feed['line']['day'] = 'holiday';
  // 平日の場合
  } else {
    feed['line']['day'] = 'weekday';
  }

  // 接続駅のカラム取得
  var 
    interchangeFromList = $('td.lowBg14 tr:eq(5) span'),
    interchangeToList = $('td.lowBg14 tr:eq(7) span');

  tbody = $('td.lowBg14 tbody');
  tr = $('td.lowBg14 tbody tr');

  for (var i = 0; i < tr.eq(1).find('span.m').size(); i++) {
    var
      href = tr.eq(4).find('span:eq(' + (i + 1) + ')').find('a').attr('href').slice(5),
      trainId = href.split('/').pop().split('.').shift();
    feed['train'].push({
      'id': trainId,
      'interchange': {
        'from': tr.eq(5).find('span.m:eq(' + (i + 1) + ')').find('a').size() > 0 ? true : false,
        'to': tr.eq(7).find('span.m:eq(' + (i + 1) + ')').find('a').size() > 0 ? true : false
      },
      'no': tr.eq(1).find('span.m:eq(' + i + ')').text(),
      'type': tr.eq(2).find('span.s:eq(' + i + ')').text().replace(/^\[(.+)\]$/, '$1'),
      'uri': baseUrl + href
    });
  }

  // HTML内のコメントからスクレイピング設定のインデックスを抽出
  self.executed($('body').get(0).lastChild.nodeValue, feed);
}

/**
 * 路線ごとの設定
 *
 * @param {string} 路線ID
 * @return {void}
 */
TrainListGenerator.prototype.setConfigByLineId = function(lineId) {
  try {
    var 
      day = ['holiday', 'saturday', 'weekday'],
      line = JSON.parse(require('fs').readFileSync(CONSTANT.DIR_LINE + '/' + lineId + '/line.html.json'));

    // 行き先数分ループ
    for (var track in line['line']['track']) {
      for (var i in day) {
        trackList = JSON.parse(require('fs').readFileSync(CONSTANT.DIR_LINE + '/' + lineId + '/' + track + '/' + day[i] + '/trackList.html.json'));

        for (var j in trackList['track']) {
          this.setConfigHtml(CONSTANT.DIR_LINE + '/' + lineId + '/' + track + '/' + day[i] + '/' + j + '.html');
        }
      }
    }
  } catch (error) {
    console.error('setConfigByLineId: %s', lineId);
  }
}

generator = new TrainListGenerator();
generator.execute();
