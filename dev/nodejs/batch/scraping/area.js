var
  domToHtml = require('/usr/local/lib/node_modules/jsdom/lib/jsdom/browser/domtohtml'),
  fs = require('fs'),
  jsdom = require('/usr/local/lib/node_modules/jsdom/lib/jsdom'),
  querystring = require('querystring'),
  Scraper = require('../lib/scraper.js'),
  util = require('util'),
  url = require('url');

// 都道府県リスト作成
var generateAreaList = function() {
  var config = [{
    'html': '../data/areaList.html',
    'scraped': function(data, index) {
      path = this.config[index].html;
      scraper = this;
    
      // スクレイピング結果をJSON出力
      fs.writeFile(path + '.json', JSON.stringify(data, null, ' '), function(err) {
        if (err) {
          throw err;
        }
    
        console.log('file[%s]: %s.json', index, path);
      });
    },
    'scraping': areaListScraping
  }];

  // スクレイピング
  scraper = new Scraper(config);
  scraper.execute();
  scraper.on('scraped', function() {
    console.log('areaList is generated.');
  });
}

// 都道府県ごとの路線リスト作成
var generateLineList = function() {
  area = JSON.parse(fs.readFileSync('../data/areaList.html.json'));
  config = [];

  // 都道府県ごと
  for (id in area) {
    var dir = '../data/' + id;

    // ディレクトリ作成
    try {
      fs.readdirSync(dir);
    } catch (e) {
      console.log('dir: %s', dir);
      fs.mkdirSync(dir, '0755');
    }

    // 路線リストスクレイピング設定作成
    config.push({
      'html': dir + '/lineList.html',
      'scraped': function(data, index) {
        path = this.config[index].html;
        scraper = this;

        // スクレイピング結果をJSON出力
        fs.writeFile(path + '.json', JSON.stringify(data, null, ' '), function(err) {
          if (err) {
            throw err;
          }

          console.log('file[%s]: %s.json', index, path);
        });
      },
      'scraping': LineListScraping,
      'uri': area[id].uri
    });
  }

  // スクレイピング
  scraper = new Scraper(config);
  scraper.execute();
  scraper.on('scraped', function() {
    console.log('lineList is generated.');
  });
}

// 各都道府県の路線ごとの駅一覧JSON生成
var generateStationList = function(areaIDList) {
  try {
    var prefectureDir = '../data/';

    // IDの指定がない場合
    if (!Array.isArray(areaIDList) || areaIDList.length === 0) {
      var
        area = JSON.parse(fs.readFileSync('../data/areaList.html.json')),
        areaIDList = [];

      for (id in area) {
        areaIDList.push(id);
      }
    }

    config = [];

    // 都道府県ごと
    for (var i in areaIDList) {
      prefectureDir = '../data/' + areaIDList[i];
      lineList = JSON.parse(fs.readFileSync(prefectureDir + '/lineList.html.json'));
      
      // 路線ごと
      for (j in lineList.line) {
        lineDir = prefectureDir + '/' + lineList.line[j].name;

        // 路線ごとのディレクトリ作成
        try {
          fs.readdirSync(lineDir);
        } catch (e) {
          fs.mkdirSync(lineDir, '0755');
          console.log('dir: %s', lineDir);
        }

        // 路線リストスクレイピング設定作成
        config.push({
          'html': lineDir + '/stationList.html',
          'scraped': function(data, index) {
            path = this.config[index].html;
            scraper = this;

            // スクレイピング結果をJSON出力
            fs.writeFile(path + '.json', JSON.stringify(data, null, ' '), function(err) {
              if (err) {
                throw err;
              }

              console.log('file[%s]: %s.json', index, path);
            });
          },
          'scraping': stationListScraping,
          'uri': lineList.line[j].uri
        });
      }
    }

    // スクレイピング
    scraper = new Scraper(config);
    scraper.execute();

    scraper.on('scraped', function() {
      console.log('stationList is generated.');
    });
  } catch (e) {
    console.error('error:' + e);
  }
}

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

var areaListScraping = function(errors, window) {
  var
    $ = window.$,
    feed = {};

  // 都道府県数分ループ
  $('#area').find('dd').find('a').each(function() {
    var href = url.parse($(this).attr('href'), true);
    feed[href.query.pref] = {
      'id': href.query.pref,
      'uri': href.href,
      'name': href.query.prefname
    };
  });

  scraper.emit('scraped-' + index, feed, index);
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
    'id': link.query.pref,
    'name': link.query.prefname,
    'line': line,
    'uri': link.protocol + '//' + link.hostname + link.pathname + '?' + querystring.stringify(query)
  };

  index = $('body').get(0).lastChild.nodeValue;
  scraper.emit(scraper.scrapedEventType(index), feed, index);
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
    'pref': link.query.pref,
    'prefName': link.query.prefname,
    'companyName': link.query.company,
    'lineName': link.query.line,
    'uri': link.protocol + '//' + link.hostname + link.pathname + '?' + querystring.stringify(query),
    'station': station
  };

  index = $('body').get(0).lastChild.nodeValue;
  scraper.emit(scraper.scrapedEventType(index), feed, index);
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

var saveFileScraped = function(data, index) {
  path = this.config[index].html;
  scraper = this;
  
  // スクレイピング結果をJSON出力
  fs.writeFile(path + '.json', JSON.stringify(data, null, ' '), function(err) {
    if (err) {
      throw err;
    }
  
    console.log('file[%s]: %s.json', index, path);
  });
}

// 都道府県一覧JSON生成
//generateAreaList();

// 都道府県ごとの路線一覧JSON生成
generateLineList();

// 路線ごとの駅一覧JSON生成
areaIDList = [];
//for (var i = 1; i <= 20; i++) {
for (var i = 21; i <= 47; i++) {
  areaIDList.push(i);
}
//generateStationList(areaIDList);

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

//stationList = JSON.parse(fs.readFileSync('../data/1/%E5%87%BD%E9%A4%A8%E6%9C%AC%E7%B7%9A/stationList.html.json'));
//generateTimeTableList(stationList);
//timetableList = JSON.parse(fs.readFileSync('../data/1/%E5%87%BD%E9%A4%A8%E6%9C%AC%E7%B7%9A/%E9%BB%92%E6%9D%BE%E5%86%85/timetableList.html.json'));
//generateTimeTable(timetableList);
