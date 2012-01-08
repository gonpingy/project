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
var generateTimeTableList = function(stationList) {
  try {
    config = [];

    // 駅ごと
    for (var i in stationList.station) {
      stationDir = '../data/' + stationList.pref + '/' + stationList.lineName + '/' + i;
      console.log(stationDir);
    
      // 駅ディレクトリ作成
      try {
        fs.readdirSync(stationDir);
      } catch (e) {
        fs.mkdirSync(stationDir, '0755');
        console.log('dir: %s', stationDir);
      }
    
      // 路線リストスクレイピング設定作成
      config.push({
        'html': stationDir + '/timetableList.html',
        'scraped': saveFileScraped,
        'scraping': timetableListScraping,
        'uri': stationList.station[i].uri
      });
    }

    // スクレイピング
    scraper = new Scraper(config);
    scraper.execute();

    scraper.on('scraped', function() {
      console.log('timetableList is generated.');
    });
  } catch (e) {
    console.error('error:' + e);
  }
}

// 各駅ごとの時刻表JSON生成
var generateTimeTable = function(timetableList) {
  try {
    config = [];

    timetableDir = '../data/' + timetableList.pref + '/' + encodeURI(timetableList.lineName) + '/' + encodeURI(timetableList.stationName.substr(0, timetableList.stationName.length - 1)) + '/timetable';

    // 駅ディレクトリ作成
    try {
      fs.readdirSync(timetableDir);
    } catch (e) {
      fs.mkdirSync(timetableDir, '0755');
      console.log('dir: %s', timetableDir);
    }
    
    // 時刻表ごと
    for (var i in timetableList.timetable) {
      // 路線リストスクレイピング設定作成
      config.push({
        'html': timetableDir + '/timetableList' + i + '.html',
        'scraped': saveFileScraped,
        'scraping': timetableScraping,
        'uri': timetableList.timetable[i].uri
      });
    }

    // スクレイピング
    scraper = new Scraper(config);
    scraper.execute();

    scraper.on('scraped', function() {
      console.log('timetable is generated.');
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
    'pref': query.pref,
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

  index = $('body').get(0).lastChild.nodeValue;
  scraper.emit(scraper.scrapedEventType(index), feed, index);
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
    'uri': uri.href,
    'stationName': $('#m-title').find('h2').text(),
  };
  
  // 時ごと
  $('table').find('tbody').find('tr').each(function() {
    var
      tr = $(this),
      hour = tr.find('td.col1').text(),
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
          'time': hour + minute,
          'form': form,
          'for': boundFor
        };
      });
  });
  
  feed['timetable'] = timetable;

  index = $('body').get(0).lastChild.nodeValue;
  console.log(index, feed);
  scraper.emit(scraper.scrapedEventType(index), feed, index);
}

// 駅ごとの時刻表一覧JSON生成
areaIDList = [];
for (var i = 1; i <= 5; i++) {
  areaIDList.push(i);
}

//var area = JSON.parse(fs.readFileSync('../data/areaList.html.json'));
//var temp = [];
//for (var areaID in area) {
//  prefectureDir = '../data/' + areaID;
//  lineList = JSON.parse(fs.readFileSync(prefectureDir + '/lineList.html.json'));
//
//  for (var i in lineList.line) {
////    stationList = JSON.parse(fs.readFileSync(prefectureDir + '/' + encodeURI(lineList.line[i].name) + '/stationList.html.json'));
//
////    for (var j in stationList.station) {
////      temp.push(stationList.station[j].name);
////    }
//  }
//}
