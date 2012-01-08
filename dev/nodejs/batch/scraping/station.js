var
  CONFIG = require('./configuration.js'),
  domToHtml = require('/usr/local/lib/node_modules/jsdom/lib/jsdom/browser/domtohtml'),
  fs = require('fs'),
  jsdom = require('/usr/local/lib/node_modules/jsdom/lib/jsdom'),
  querystring = require('querystring'),
  Scraper = require('../../lib/scraper.js'),
  util = require('util'),
  url = require('url');

// 各都道府県の路線ごとの駅一覧JSON生成
var generateStationList = function(prefectureIDList) {
  try {
    // IDの指定がない場合
    if (!Array.isArray(prefectureIDList) || prefectureIDList.length === 0) {
      var
        prefectureDir = JSON.parse(fs.readFileSync(HTML_PREFECTURE_LIST + '.json')),
        prefectureIDList = [];

      for (id in prefectureDir) {
        prefectureIDList.push(id);
      }
    }

    config = [];

    // 都道府県ごと
    while (prefectureID = prefectureIDList.shift()) {
      prefectureDir = CONFIG.DIR_DATA + '/' + prefectureID;
      lineList = JSON.parse(fs.readFileSync(prefectureDir + '/lineList.html.json'));

      // 路線ごと
      for (var i in lineList.line) {
        lineDir = prefectureDir + '/' + lineList.line[i].name;

        // 路線ごとのディレクトリ作成
        try {
          fs.readdirSync(lineDir);
        } catch (e) {
          fs.mkdirSync(lineDir, '0755');
          console.log('dir: %s', lineDir);
        }

        // 路線リストスクレイピング設定作成
        config.push({
          'executed': function(index, result) {
            var
              path = this.config[index].html,
              self = this;

            // スクレイピング結果をJSON出力
            fs.writeFile(path + '.json', JSON.stringify(result, null, ' '), function(err) {
              if (err) {
                throw err;
              }

              console.log('file[%s]: %s.json', index, path);
            });
          },
          'html': lineDir + '/stationList.html',
          'scraping': stationListScraping,
          'uri': lineList.line[i].uri
        });
      }
    }

    // スクレイピング
    scraper = new Scraper(config);
    scraper.execute(function() {
      console.log('stationList is generated.');
    });
  } catch (e) {
    console.error('error:' + e);
  }
}

var stationListScraping = function(errors, window) {
  var
    $ = window.$,
    feed = {},
    link = {},
    query = {},
    station = {};

  // 路線数分ループ
  $('#station').find('ul').find('li').find('a').each(function() {
    link = url.parse($(this).attr('href'), true);

    station[link.query.st] = {
      'name': link.query.st,
      'uri': $(this).attr('href')
    };

  });

  query = link.query;
  delete(query.st);

  feed = {
    'prefID': link.query.pref.replace( /^([1-9])$/, '0$1'),
    'prefName': link.query.prefname,
    'companyName': link.query.company,
    'lineName': link.query.line,
    'uri': link.protocol + '//' + link.hostname + link.pathname + '?' + querystring.stringify(query),
    'station': station
  };

  // HTML内のコメントからスクレイピング設定のインデックスを抽出
  self.executed($('body').get(0).lastChild.nodeValue, feed);
}

prefectureList = JSON.parse(fs.readFileSync(CONFIG.HTML_PREFECTURE_LIST + '.json'));
prefectureIDList = [];

for (id in prefectureList) {
  prefectureIDList.push(id);
}

// 路線ごとの駅一覧JSON生成
generateStationList(prefectureIDList.slice(0, prefectureIDList.length));
