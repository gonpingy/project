var
  CONFIG = require('./configuration.js'),
  domToHtml = require('/usr/local/lib/node_modules/jsdom/lib/jsdom/browser/domtohtml'),
  fs = require('fs'),
  jsdom = require('/usr/local/lib/node_modules/jsdom/lib/jsdom'),
  querystring = require('querystring'),
  Scraper = require('../../lib/scraper.js'),
  util = require('util'),
  url = require('url');

// 都道府県ごとの路線リスト作成
var generateLineList = function() {
  prefectureList = JSON.parse(fs.readFileSync(CONFIG.HTML_PREFECTURE_LIST + '.json'));
  config = [];

  // 都道府県ごと
  for (id in prefectureList) {
    var prefectureDir = CONFIG.DIR_DATA + '/' + id;

    // ディレクトリ作成
    try {
      fs.readdirSync(prefectureDir);
    } catch (e) {
      console.log('dir: %s', prefectureDir);
      fs.mkdirSync(prefectureDir, '0755');
    }

    // 路線リストスクレイピング設定作成
    config.push({
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
      'html': prefectureDir + '/lineList.html',
      'scraping': LineListScraping,
      'uri': prefectureList[id].uri
    });
  }

  // スクレイピング
  scraper = new Scraper(config);
  scraper.execute(function() {
    console.log('lineList is generated.');
  });
}

var LineListScraping = function(errors, window) {
  var
    $ = window.$,
    feed = {};
    line = [],
    link = [];

  // 路線数分ループ
  $('#rail').find('dd').find('a').each(function() {
    link = url.parse($(this).attr('href'), true);
    line.push({
      'name': link.query.line,
      'uri': $(this).attr('href')
    });
  });

  query = link.query;
  delete(query.line);

  feed = {
    'id': link.query.pref.replace( /^([1-9])$/, '0$1'),
    'name': link.query.prefname,
    'line': line,
    'uri': link.protocol + '//' + link.hostname + link.pathname + '?' + querystring.stringify(query)
  };

  // HTML内のコメントからスクレイピング設定のインデックスを抽出
  self.executed($('body').get(0).lastChild.nodeValue, feed);
}

// 都道府県ごとの路線一覧JSON生成
generateLineList();
