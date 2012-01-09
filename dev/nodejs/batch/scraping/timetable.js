var
  CONFIG = require('./configuration.js'),
  domToHtml = require('/usr/local/lib/node_modules/jsdom/lib/jsdom/browser/domtohtml'),
  fs = require('fs'),
  jsdom = require('/usr/local/lib/node_modules/jsdom/lib/jsdom'),
  querystring = require('querystring'),
  Scraper = require('../../lib/scraper.js'),
  util = require('util'),
  url = require('url');

// 各駅の時刻表ごとのJSON生成
var generateTimeTable = function(timeTableListList) {
  try {
    config = [];

    // 駅ごと
    for (var i = 0; i < timeTableListList.length; i++) {
      // 時刻表ごと
      for (var index in timeTableListList[i].timetable) {
        stationDir = CONFIG.DIR_DATA + '/' + timeTableListList[i].prefID + '/' + timeTableListList[i].lineName + '/' + timeTableListList[i].stationName.substr(0, timeTableListList[i].stationName.length - 1);

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
          'html': stationDir + '/' + index + '.html',
          'scraping': timetableScraping,
          'uri': timeTableListList[i].timetable[index].uri
        });
      }
    }

    // スクレイピング
    scraper = new Scraper(config);
    scraper.execute(function() {
      console.log('timetable is generated.');
    });
  } catch (e) {
    console.error('error:' + e);
  }
}

var timetableScraping = function(errors, window) {
  var
    $ = window.$,
    feed = {};
    timetable = {},
    uri = url.parse($('#station-nav').find('ul').find('li').find('h3').find('a').attr('href').replace('\/top\/', '\/time\/'), true),
    query = uri.query,
    kind = query.kind;

  feed = {
    'pref': query.pref,
    'prefName': query.prefname,
    'companyName': query.company,
    'lineName': query.line,
    'gid': query.gid,
    'kind': query.kind,
    'uri': uri.href,
    'stationName': $('#m-title').find('h2').text(),
  };
  
  // 日にちを取得
  $('#timetable').find('table').find('th').find('ul').find('li').each(function() {
    if ($(this).find('a').size() == 0) {
      feed['date'] = $(this).text();
    }
  });

  // 行き先を取得
  $('#timetable').find('ul').find('li').find('h5').each(function() {
    if ($(this).find('a').size() == 0) {
      feed['for'] = $(this).text();
    }
  });

  // 時ごと
  $('table').find('tbody').find('tr').each(function() {
    var
      tr = $(this),
      hour = tr.find('td.col1').text().replace( /^([1-9])$/, '0$1'),
      minute = ''.
      form = '',
      boundFor = '';
  
      // 分ごと
      tr.find('td.col2').find('dl').each(function() {
        var dl = $(this);
        minute = dl.find('dt').text();
        form = dl.find('dd.trn-cls').text();
        boundFor = dl.find('dd.sta-for').text();
  
        timetable[hour] = {
          'time': hour.replace( /^([1-9])$/, '0$1') + minute,
          'form': form,
          'for': boundFor
        };
      });
  });
  
  feed['timetable'] = timetable;

  // HTML内のコメントからスクレイピング設定のインデックスを抽出
  self.executed($('body').get(0).lastChild.nodeValue, feed);
}

prefectureList = JSON.parse(fs.readFileSync(CONFIG.HTML_PREFECTURE_LIST + '.json'));
prefectureIDList = [];

timeTableListList = [];

// 都道府県数分ループ
for (var prefectureID in prefectureList) {
  prefectureDir = CONFIG.DIR_DATA + '/' + prefectureID;
  lineList = JSON.parse(fs.readFileSync(prefectureDir + '/lineList.html.json'));

  // 路線数分ループ
  for (var i in lineList.line) {
    lineDir = prefectureDir + '/' + lineList.line[i].name;
    stationList = JSON.parse(fs.readFileSync(prefectureDir + '/' + lineList.line[i].name + '/stationList.html.json'));

    // 駅数分ループ
    for (var stationName in stationList.station) {
      timeTableListList.push(JSON.parse(fs.readFileSync(prefectureDir + '/' + lineList.line[i].name + '/' + stationName + '/timetableList.html.json')));
    break;
    }
    break;
  }
    break;
}

// 駅ごとの時刻表一覧JSON生成
switch (process.argv.length) {
  case 2:
    begin = 0;
    end = timeTableListList.length;
    break;
  case 3:
    begin = process.argv[2];
    end = timeTableListList.length;
    break;
  case 4:
    begin = process.argv[2];
    end = process.argv[3];
    break;
  default:
    throw new Error('error!');
}

if (begin < 0
&& end > timeTableListList.length) {
  throw new Error('error!');
}

generateTimeTable(timeTableListList.slice(begin, end));
