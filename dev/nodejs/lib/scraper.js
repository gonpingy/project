var
  domToHtml = require('/usr/local/lib/node_modules/jsdom/lib/jsdom/browser/domtohtml'),
  events = require('events'),
  fs = require('fs'),
  jsdom = require('/usr/local/lib/node_modules/jsdom/lib/jsdom'),
  util = require('util'),
  url = require('url');

/**
 * コンストラクタ
 * @param {Array} config スクレイピング設定
 * @constructor
 */
var Scraper = function(config) {
  this.setConfig(config);
}

// EventEmitterを継承
util.inherits(Scraper, events.EventEmitter);
module.exports = Scraper;

Scraper.prototype.interval = 200;
Scraper.prototype.result = [];

/**
 * スクレイピングを実行する
 */
Scraper.prototype.execute = function(callback) {
  this.result = [], indexList = [];

  // 設定配列のインデックスを抽出
  for (index in this.config) {
    indexList.push(index);
  }

  // 処理終了後のコールバックが設定されている場合
  if (callback) {
    this.on('executed', callback);
  }

  this
    .on('execute', function() {
      // 一定範囲のスクレイピングが完了
      this.once(this.executeEvent(indexList[0]), function() {
        // 次の範囲のスクレイピング実行
        this.emit('execute');
      });

      // 全て並列で処理すると落ちてしまうため
      // intervalに設定されている数で分割して処理していく
      for (var i = 0; i < this.interval; i++) {
        index = indexList.shift();

        // 設定がまだある場合
        if (index !== undefined) {
          console.log(this.config[index]);

          // リモートへアクセス
          if (this.config[index].uri) {
            this.request(index);
          // ローカルファイル読み込み
          } else {
            this.read(index);
          }

          this
            // スクレイピング対象のHTML取得後のスクレイピング処理
            .once(this.scrapingEventType(index), function(index, html) {
              self = this;

              console.log('scraping[%s]', index);

              // スクレイピング設定のインデックスをHTML内にコメントとして無理矢理入れこむ
              // スクレイピングメソッドではこのコメントからインデックスを抽出し、どの設定でのスクレイピングか判別できるようにする
              jsdom.env(
                html.replace('</body>', '<!--' + index + '--></body>'),
                ['jquery-1.6.min.js'],
                this.config[index].scraping
              );
            })
          // スクレイピング後の処理
          .once(this.executedEvent(index), this.config[index].executed)
          // Scraper内部でのスクレイピング後の処理
          .once(this.executedEvent(index), function(index, result) {
            // スクレイピング結果を保存
            this.result[index] = result;

            console.log('executed[%s]: %d/%d', index, this.result.length, this.config.length);

            // 全てのスクレイピングが完了した場合
            if (this.result.length == this.config.length) {
              this.emit('executed');
            // 一定範囲のスクレイピングが完了したら再度スクレイピング
            // 前回の範囲の処理が終わりきっていない場合があるため、リスナーが登録されているかもチェックする
            } else if (this.result.length % this.interval == 0 && this._events[this.executeEvent(index)]) {
              this.emit(this.executeEvent(index));
            }
          });
        // 設定がない場合
        } else {
          break;
        }
      }
    });

  this.emit('execute');
}

/**
 * 処理終了後に実行すべきイベントを実行
 * @param {number} index 設定のインデックス
 * @param {Object} result コールバック実行結果で返したいデータ
 */
Scraper.prototype.executed = function(index, result) {
  this.emit(this.executedEvent(index), index, result);
}

Scraper.prototype.executedEvent = function(index) {
  return 'executed-' + index;
}

Scraper.prototype.executeEvent = function(index) {
  return 'execute-' + Math.floor(index / this.interval);
}

/**
 * スクレイピング対象をローカルから読み込み、スクレイピングする
 * @param {string} 設定のインデックス
 */
Scraper.prototype.read = function(index) {
  console.info('local access[%s]: %s', index, this.config[index].html);

  self = this;

  fs.readFile(this.config[index].html, 'utf-8', function(err, data) {
    if (err) {
      throw err;
    }

    self.emit(scraper.scrapingEventType(index), index, data);
  });
}

/**
 * スクレイピング対象をリモートからアクセスし、スクレイピングする
 * @param {string} 設定のインデックス
 */
Scraper.prototype.request = function(index) {
  console.info('remote access[%s]: %s', index, this.config[index].uri);

  var
    filename = this.config[index].html,
    uri = url.parse(this.config[index].uri),
    options = {
      'host': uri.hostname,
      'method': 'GET', // ひとまずGETで固定
      'path': uri.pathname + uri.search
    },
    self = this;

  var request = require('http').request(options, function(response) {
    // HTTPリクエストが失敗の場合
    if (response.statusCode != 200) {
      console.log('failed', response.statusCode, response.headers);
      return;
    }

    var chunks = [];

    response
      .on('data', function(chunk) {
        chunks.push(chunk.toString());
      })
      .on('end', function() {
        var data = chunks.join('');

        // 取得したHTMLを保存
        fs.writeFile(filename, data, 'utf-8', function(err) {
          if (err) {
            throw err;
          }
        });

        // スクレイピング実行
        self.emit(self.scrapingEventType(index), index, data);
      });
  });

  request.end();
}

Scraper.prototype.scrapingEventType = function(index) {
  return 'scraping-' + index;
}

Scraper.prototype.setConfig = function(config) {
  configDefault = {
    'html': './scraper.html',
    'executed': function() {
      console.log('defaut executed function');
    },
    'scraping': function(errors, window) {
      console.log('defaut scraping function');
    }
  };

  this.config = config instanceof Array === true ? config : [config];

  for (var i in this.config) {
    this.config[i].html = this.config[i].html || configDefault.html;
    this.config[i].executed = this.config[i].executed || configDefault.executed;
    this.config[i].scraping = this.config[i].scraping || configDefault.scraping;
  }
};
