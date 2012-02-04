var
  CONFIG = require('./configuration.js'),
  domToHtml = require('/usr/local/lib/node_modules/jsdom/lib/jsdom/browser/domtohtml'),
  fs = require('fs'),
  jsdom = require('/usr/local/lib/node_modules/jsdom/lib/jsdom'),
  querystring = require('querystring'),
  Scraper = require('../../lib/scraper.js'),
  util = require('util'),
  url = require('url');

// 都道府県リスト作成
var generateAreaList = function() {
  var config = [{
    'executed': function(index, result) {
      var
        path = this.config[index].html,
        self = this;
    
      // スクレイピングの結果をJSON出力
      fs.writeFile(path + '.json', JSON.stringify(result, null, ' '), function(err) {
        if (err) {
          throw err;
        }
    
        console.log('file[%s]: %s.json', index, path);
      });
    },
    'html': CONFIG.HTML_PREFECTURE_LIST,
    'scraping': areaListScraping,
    'uri': 'http://transit.loco.yahoo.co.jp/station/list/'
  }];

  // スクレイピング
  scraper = new Scraper(config);
  scraper.execute(function() {
    console.log('prefectureList is generated.');
  });
}

var areaListScraping = function(errors, window) {
  var
    $ = window.$,
    feed = {};

  // 都道府県数分ループ
  $('#area').find('dd').find('a').each(function() {
    var
      href = url.parse($(this).attr('href'), true),
      id = href.query.pref.replace( /^([1-9])$/, '0$1');

    feed[id] = {
      'id': id,
      'uri': href.href,
      'name': href.query.prefname
    };
  });

  // HTML内のコメントからスクレイピング設定のインデックスを抽出
  self.executed($('body').get(0).lastChild.nodeValue, feed);
}

// 都道府県一覧JSON生成
generateAreaList();
