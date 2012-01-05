var
  domToHtml = require('/usr/local/lib/node_modules/jsdom/lib/jsdom/browser/domtohtml'),
  events = require('events'),
  fs = require('fs'),
  jsdom = require('/usr/local/lib/node_modules/jsdom/lib/jsdom'),
  util = require('util'),
  url = require('url');

/**
 * コンストラクタ
 * @param {Array} config HTTPリクエスト設定
 * @constructor
 */
var Requester = function(config) {
  this.setConfig(config);
}

// EventEmitterを継承
util.inherits(Requester, events.EventEmitter);
module.exports = Requester;

Requester.prototype.data = [];
Requester.prototype.interval = 10;

/**
 * HTTPリクエストを実行する
 * @param {string} 設定のインデックス
 */
Requester.prototype.request = function() {
  for (var index in this.config) {
    console.info('http request[%s]: %s', index, this.config[index].uri);

    this
      .once(this.requestedEventType(index), this.config[index].requested)
      .once(this.requestedEventType(index), function(data, index) {
        // HTTPリクエストの結果を保存
        this.data[index] = data;

        console.log('requested[%s]: %d/%d', index, this.data.length, this.config.length);

        // 全ての実行完了した場合
        if (this.data.length == this.config.length) {
          this.emit('requested');
        }
      });

    this._request(index);
  }
}

Requester.prototype._request = function(index) {
  var
    requester = this,
    uri = url.parse(this.config[index].uri),
    options = {
      'host': uri.hostname,
      'method': this.config[index].method,
      'path': uri.pathname + uri.search
    };
  
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

        // HTTPリクエスト実行後のコールバック処理
        requester.emit(requester.requestedEventType(index), data, index);
      });
  });
  
  request.end();
}

Requester.prototype.requestedEventType = function(index) {
  return 'requested-' + index;
}

Requester.prototype.setConfig = function(config) {
  configDefault = {
    'method': 'GET',
    'requested': function() {
      console.log('defaut requested function');
    },
    'uri': 'http://www.yahoo.co.jp'
  };

  this.config = config instanceof Array === true ? config : [config];

  for (var i in this.config) {
    this.config[i].method = this.config[i].method || configDefault.method;
    this.config[i].requested = this.config[i].requested || configDefault.requested;
    this.config[i].uri = this.config[i].uri || configDefault.uri;
  }
};
