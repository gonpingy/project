var
  CONFIG = require('./configuration.js'),
  domToHtml = require('/usr/local/lib/node_modules/jsdom/lib/jsdom/browser/domtohtml'),
  fs = require('fs'),
  jsdom = require('/usr/local/lib/node_modules/jsdom/lib/jsdom'),
  querystring = require('querystring'),
  Scraper = require('../../lib/scraper.js'),
  util = require('util'),
  url = require('url');

// 各駅ごとの時刻表一覧JSON生成
var generateTimeTableList = function(lineList) {
  try {
    config = [];

    // 駅ごと
    while (line = lineList.shift()) {
      for (var station in line.station) {
        stationDir = CONFIG.DIR_DATA + '/' + line.prefID + '/' + line.lineName + '/' + station;

        // 駅ディレクトリ作成
        try {
          fs.readdirSync(stationDir);
        } catch (e) {
          fs.mkdirSync(stationDir, '0755');
          console.log('dir: %s', stationDir);
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
          'html': stationDir + '/timetableList.html',
          'scraping': timetableListScraping,
          'uri': line.station[station].uri
        });
      }
    }

    // スクレイピング
    scraper = new Scraper(config);
    scraper.execute(function() {
      console.log('timetableList is generated.');
    });
  } catch (e) {
    console.error('error:' + e);
  }
}

var timetableListScraping = function(errors, window) {
  var
    $ = window.$,
    feed = {};
    timetable = {},
    uri = url.parse($('#station-nav').find('ul').find('li').find('h3').find('a').attr('href').replace('\/top\/', '\/time\/'), true),
    query = uri.query,
    kind = query.kind;

  feed = {
    'prefID': query.pref.replace( /^([1-9])$/, '0$1'),
    'prefName': query.prefname,
    'companyName': query.company,
    'lineName': query.line,
    'uri': uri.href,
    'stationName': $('#m-title').find('h2').text(),
    'timetable': timetable
  };

  // 日にちごと
  $('#timetable').find('table').find('th').find('ul').find('li').each(function() {
    // リンクの場合
    if ($(this).find('a').size() > 0) {
      uri = url.parse($(this).find('a').attr('href'), true);
      query = uri.query;
      kind = query.kind;
    } else {
      kind = '1';
    }

    var goFor = $(this).text();
    
    // 行き先ごと
    $('#timetable').find('ul').find('li').find('h5').each(function() {
      // リンクの場合
      if ($(this).find('a').size() > 0) {
        uri = url.parse($(this).find('a').attr('href'), true);
        query = uri.query;
        query.kind = kind;
      } else {
        query.gid = '1';
      }

      timetable[query.gid + query.kind] = {
        'gid': query.gid,
        'kind': query.kind,
        'date': $(this).text(),
        'for': goFor,
        'uri': 'http://' + uri.hostname + uri.pathname + '?' + querystring.stringify(query)
      };
    });
  });

  feed['timetable'] = timetable;

  // HTML内のコメントからスクレイピング設定のインデックスを抽出
  self.executed($('body').get(0).lastChild.nodeValue, feed);
}

prefectureList = JSON.parse(fs.readFileSync(CONFIG.HTML_PREFECTURE_LIST + '.json'));
prefectureIDList = [];

lineListList = [];

// 都道府県数分ループ
for (var prefectureID in prefectureList) {
  prefectureDir = CONFIG.DIR_DATA + '/' + prefectureID;
  lineList = JSON.parse(fs.readFileSync(prefectureDir + '/lineList.html.json'));

  // 路線数分ループ
  for (var i in lineList.line) {
    lineDir = prefectureDir + '/' + lineList.line[i].name;
    lineListList.push(JSON.parse(fs.readFileSync(prefectureDir + '/' + lineList.line[i].name + '/stationList.html.json')));
  }
}

// 駅ごとの時刻表一覧JSON生成
generateTimeTableList(lineListList.slice(133, lineListList.length));
