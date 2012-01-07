var
  events = require('events'),
  fs = require('fs'),
  mysql = require('/usr/local/lib/node_modules/mysql/lib/mysql'),
  util = require('util');

/**
 * コンストラクタ
 * @param {Object} config DB設定
 * @param {Array} config SQL設定
 * @constructor
 */
var DB = function(config_db, config_sql) {
  this.setConfig(config_sql);

  // DBコネクションオープン
  this.client = mysql.createClient({
    'database': config_db.database,
    'host': config_db.host,
    'password': config_db.password,
    'user': config_db.user
  });
}

// EventEmitterを継承
util.inherits(DB, events.EventEmitter);
module.exports = DB;

DB.prototype.client = null;
DB.prototype.config = null;

/**
 * SQL設定を元にSQLを実行する
 */
DB.prototype.execute = function() {
  try {
    this.result = [], indexList = [];

    // SQL設定数分実行
    for (index in this.config) {
      // todo 他のコールバック入れる
      // 処理実行後にクラス内部で行うイベント
      this.once(this.executedEvent(index), function(result, index) {
        // 結果を保存
        this.result[index] = result;
    
        console.log('executed[%s]: %d/%d', index, this.result.length, this.config.length);
    
        // 全ての処理が完了した場合
        if (this.result.length == this.config.length) {
          // DBコネクションクローズ
          this.client.end();

          // 処理終了後のイベントを投げる
          this.emit('executed');
        }
      });

      this.query(index);
    }
  // エラーが起こった場合
  } catch(e) {
    // DBコネクションクローズ
    this.client.end();
  }
}

DB.prototype.result = [];

DB.prototype.query = function(index) {
  self = this;

  // SQL実行
  this.client.query(this.config[index].sql, this.config[index].parameters, function(err, results, fields) {
      console.error(err);
    // エラーが起こった場合
    if (err) {
      // エラーを結果に入れる
      results = err;

      // ログ出力（ERROR）
      console.error(err);
    }

    self.callBackDone(index, results);
  });
}

/**
 * コールバック処理終了後に実行すべきイベント名を返す
 * @param {number} index 設定のインデックス
 */
DB.prototype.executedEvent = function(index) {
  return 'executed-' + index;
}

/**
 * コールバック処理終了後に実行すべきイベントを実行
 * @param {number} index 設定のインデックス
 * @param {Object} result コールバック実行結果で返したいデータ
 */
DB.prototype.callBackDone = function(index, result) {
  this.emit(this.executedEvent(index), result, index);
}

/**
 * 実行するSQLを設定をする
 * @param {Array} config SQL設定
 */
DB.prototype.setConfig = function(config) {
  this.config = config instanceof Array === true ? config : [config];
};
