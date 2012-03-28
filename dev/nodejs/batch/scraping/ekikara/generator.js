var
  CONSTANT = require('./constant.js'),
  fs = require('fs'),
  opts = require('opts'),
  Scraper = require('/Users/gonpingy/project/dev/nodejs/lib/scraper.js'),
  url = require('url');

/**
 * コンストラクタ
 * @constructor
 */
var Generator = function() {
  this.setConfig();
};

module.exports = Generator;

Generator.prototype.config = [];
Generator.prototype.start = 1;
Generator.prototype.results = 50;

/**
 * スクレイピング実行
 */
Generator.prototype.execute = function(callback) {
  try {
    var
      config = [],
      i = (this.start - 1) * this.results,
      scraper = new Scraper(),
      self = this;

    // スクレイピング対象分ループ
    for (; i < Math.floor(this.start * this.results) && i < this.config.length; i++) {
      config.push(this.config[i]);
    }

    console.log('index: %d/%d', this.start, Math.ceil(this.config.length / this.results) + 1);

    scraper.setConfig(config);
    scraper.execute(function() {
      // スクレイピング対象が残っている場合
      if (self.start <= (self.config.length / self.results) + 1) {
        self.start++;
        self.execute();
      // 全てスクレイピングした場合
      } else {
        self.executed();
      }
    });
  } catch (error) {
    console.error('error: index=%d', this.start); 
  }
};

/**
 * スクレイピング後に実行する処理
 * @param {number} index 
 * @param {Object} スクレイピング結果
 * @return {void}
 */
Generator.prototype.scraped = function(index, result) {
  var
    path = this.config[index].html,
    self = this;

  // スクレイピングの結果をJSON出力
  fs.writeFile(path + '.json', JSON.stringify(result), function(err) {
    if (err) {
      throw err;
    }
  
    console.log('file[%s]: %s.json', index, path);
  });
};

/**
 * スクレイピング設定
 *
 * @return {void}
 */
Generator.prototype.setConfig = function() {
  var
    options = [
      {
        'short': 'd',
        'long': 'dir',
        'description': 'dir',
        'value': true
      },
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
    }
  // 路線ID指定
  } else if (opts.get('l')) {
    this.setConfigByLineId(opts.get('l'));
  // ファイル指定
  } else if (opts.get('f')) {
    this.setConfigByFile(opts.get('f'));
  // 指定がない場合
  } else {
    // 全都道府県数分ループ
    for (var prefectureId = 1; prefectureId < 48; prefectureId++) {
      prefectureId = String(prefectureId).replace(/^([1-9]{1})$/, '0$1');
      this.setConfigByPrefectureId(prefectureId);
    }
  }

  this.results = opts.get('r') !== undefined ? opts.get('r') : CONSTANT.RESULTS_DEFAULT;
  this.start = opts.get('s') !== undefined ? opts.get('s') : CONSTANT.START_DEFAULT;
};

/**
 * ファイルでスクレイピング設定
 *
 * @param {String} ファイルパス
 * @return {void}
 */
Generator.prototype.setConfigByFile = function(file) {
  var lines = require('fs').readFileSync(file,  'utf-8').toString().split('\n');

  // 行数分ループ
  for (i = 0; i < lines.length - 1; i++) {
    this.setConfigHtml(lines[i]);
  }
};

/**
 * 路線ごとの設定
 *
 * @param {string} 路線ID
 * @return {void}
 */
Generator.prototype.setConfigByLineId = function(lineId) {
  throw 'error: setConfigByLineId is not allowed';
};

/**
 * 都道府県ごとの設定
 *
 * @param {string} 都道府県ID
 * @return {void}
 */
Generator.prototype.setConfigByPrefectureId = function(prefectureId) {
  try {
    var lineList = JSON.parse(require('fs').readFileSync(CONSTANT.DIR_PREFECTURE + '/' + prefectureId + '.html.json'));

    // 路線数分ループ
    for (var lineId in lineList.line) {
      this.setConfigByLineId(lineId);
    }
  } catch (error) {
    console.error('setConfigByPrefectureId: %s', prefectureId);
  }
};

/**
 * スクレイピング対象のHTMLを設定する
 *
 * @param {string} HTMLファイルのパス
 * @return {void}
 */
Generator.prototype.setConfigHtml = function(html) {
  this.config.push({
    'executed': this.scraped,
    'html' : html,
    'scraping': this.scraping
  });
}

process.on('uncaughtException', function(err) {
  console.error('uncaughtException:%j', err);
});
