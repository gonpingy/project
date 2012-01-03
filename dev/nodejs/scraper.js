var
  domToHtml = require('/usr/local/lib/node_modules/jsdom/lib/jsdom/browser/domtohtml'),
  events = require('events'),
  fs = require('fs'),
  jsdom = require('/usr/local/lib/node_modules/jsdom/lib/jsdom'),
  util = require('util'),
  url = require('url');

var Scraper = function(config) {
  this.setConfig(config);
}

// EventEmitterを継承
util.inherits(Scraper, events.EventEmitter);
module.exports = Scraper;

Scraper.prototype.data = [];
Scraper.prototype.interval = 10;

Scraper.prototype.read = function(index) {
  console.info('local access[%s]: %s', index, this.config[index].html);

  scraper = this;

  fs.readFile(this.config[index].html, 'utf-8', function(err, data) {
    if (err) {
      throw err;
    }

    scraper.emit('scraping-' + index, data);
  });
}

Scraper.prototype.request = function(index) {
  console.info('remote access[%s]: %s', index, this.config[index].uri);

  var
    filename = this.config[index].html,
    scraper = this,
    uri = url.parse(this.config[index].uri),
    client = require('http').createClient(uri.port || 80, uri.hostname),
    request = client.request(
      'GET',
      uri.pathname + uri.search,
      {host: uri.hostname}
    );

  request.on('response', function(response) {
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
        var html = chunks.join('');

        // 取得したHTMLを保存
        fs.writeFile(filename, html, 'utf-8', function(err) {
          if (err) {
            throw err;
          }
        });

        scraper.emit('scraping-' + index, html, index);
      });
  });

  request.end();
}

Scraper.prototype.scrape = function() {
  this.data = [], indexList = [];

  // 設定配列のキーを抽出
  for (index in this.config) {
    indexList.push(index);
  }

  this
    .on('scrape', function() {
      this.once(this.scrapeEventType(indexList[0]), function() {
        this.emit('scrape');
      });

      for (var i = 0; i < this.interval; i++) {
        index = indexList.shift();

        if (index !== undefined) {
          // リモートへアクセス
          if (this.config[index].uri) {
            this.request(index);
          // ローカルファイル読み込み
          } else {
            this.read(index);
          }

          this
            // スクレイピング対象のHTML取得後のスクレイピング処理
            .once(this.scrapingEventType(index), function(html, index) {
              scraper = this;

              console.log('scrapping[%s]', index);

              // スクレイピング設定のインデックスをHTML内にコメントとして無理矢理入れこむ
              jsdom.env(
                html.replace('</body>', '<!--' + index + '--></body>'),
                ['http://code.jquery.com/jquery-1.5.min.js'],
                this.config[index].scraping
              );
            })
          // スクレイピング後の処理
          .once(this.scrapedEventType(index), this.config[index].scraped)
          // Scraper内部でのスクレイピング後の処理
          .once(this.scrapedEventType(index), function(data, index) {
            // スクレイピング結果を保存
            this.data[index] = data;

            console.log('scraped[%s]: %d/%d', index, this.data.length, this.config.length);

            // 全てのスクレイピングが完了した場合
            if (this.data.length == this.config.length) {
              this.emit('scraped');
            // 一定範囲のスクレイピングが完了したら再度スクレイピング
            // 前回の範囲の処理が終わりきっていない場合があるため、リスナーが登録されているかもチェックする
            } else if (this.data.length % this.interval == 0 && this._events[this.scrapeEventType(index)]) {
              this.emit(this.scrapeEventType(index));
            }
          });
        }
      }
    });

  this.emit('scrape');
}

Scraper.prototype.scrapedEventType = function(index) {
  return 'scraped-' + index;
}

Scraper.prototype.scrapeEventType = function(index) {
  return 'scrape-' + Math.floor(index / this.interval);
}

Scraper.prototype.scrapingEventType = function(index) {
  return 'scraping-' + index;
}

Scraper.prototype.setConfig = function(config) {
  configDefault = {
    'html': './scraper.html',
    'scraped': function() {
      console.log('defaut scraped function');
    },
    'scraping': function(errors, window) {
      console.log('defaut scraping function');
    }
  };

  this.config = config instanceof Array === true ? config : [config];

  for (var i in this.config) {
    this.config[i].html = this.config[i].html || configDefault.html;
    this.config[i].scraped = this.config[i].scraped || configDefault.scraped;
    this.config[i].scraping = this.config[i].scraping || configDefault.scraping;
  }
};
