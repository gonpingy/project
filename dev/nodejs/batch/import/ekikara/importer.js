var
  CONSTANT = require('./constant.js'),
  DB = require('/Users/gonpingy/project/dev/nodejs/lib/db.js'),
  mysql = require('mysql'),
  opts = require('opts'),
  url = require('url');

/**
 * コンストラクタ
 * @constructor
 */
var Importer = function() {
  this.setConfig();
};

module.exports = Importer;

Importer.prototype.config = [];

/**
 * スクレイピング実行
 */
Importer.prototype.execute = function(callback) {
  try {
    var 
      config_db = {
        'database': CONSTANT.MYSQL_DATABASE,
        'host': CONSTANT.MYSQL_HOST,
        'password': CONSTANT.MYSQL_PASSWORD,
        'user': CONSTANT.MYSQL_USER
      };
      db = new DB(config_db),
      self = this;

    db.setConfig(this.config);
    db.execute(function() {
      self.executed();
    });
  } catch (error) {
    console.error('error: db error');
  }
};

/**
 * インポート設定
 *
 * @return {void}
 */
Importer.prototype.setConfig = function() {
  var
    htmlList = [],
    options = [
      {
        'short': 'f',
        'long': 'file',
        'description': 'file',
        'value': true
      },
      {
        'short': 'l',
        'long': 'line',
        'description': 'line id',
        'value': true
      },
      {
        'short': 'p',
        'long': 'prefecture',
        'description': 'prefecture id',
        'value': true
      },
      {
        'short': 'r',
        'long': 'results',
        'description': 'start',
        'value': true
      },
      {
        'short': 's',
        'long': 'start',
        'description': 'start',
        'value': true
      },
      {
        'short': 't',
        'long': 'train',
        'description': 'train id',
        'value': true
      }
    ];

  opts.parse(options);

  // 都道府県ID指定
  if (opts.get('p')) {
    try {
      this.setConfigByPrefectureId(opts.get('p'));
    } catch (error) {
      console.error(error);
    }
  // 路線ID指定
  } else if (opts.get('l')) {
    this.setConfigByLineId(opts.get('l'));
  // 指定がない場合
  } else {
    // 全都道府県数分ループ
    for (var prefectureId = 1; prefectureId < 48; prefectureId++) {
      prefectureId = String(prefectureId).replace(/^([1-9]{1})$/, '0$1');
      this.setConfigByPrefectureId(prefectureId);
    }
  }
};

/**
 * 路線ごとの設定
 *
 * @param {string} 路線ID
 * @return {void}
 */
Importer.prototype.setConfigByLineId = function(lineId) {
  throw 'error: setConfigByLineId is not allowed';
};

/**
 * 都道府県ごとの設定
 *
 * @param {string} 都道府県ID
 * @return {void}
 */
Importer.prototype.setConfigByPrefectureId = function(prefectureId) {
  try {
    var prefecture = JSON.parse(require('fs').readFileSync(CONSTANT.DIR_PREFECTURE + '/' + prefectureId + '.html.json'));
console.log(prefecture);
    // 路線数分ループ
    for (var lineId in prefecture.line) {
      this.setConfigByLineId(lineId);
    }
  } catch (error) {
    console.error('setConfigByPrefectureId: %s', prefectureId);
  }
};

process.on('uncaughtException', function(err) {
  console.error('uncaughtException:%j', err);
});
