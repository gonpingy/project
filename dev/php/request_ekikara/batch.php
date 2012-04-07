<?php
require_once('/Users/gonpingy/project/dev/php/request_ekikara/constant.php');
require_once('/Users/gonpingy/project/dev/php/lib/Logger.php');
require_once('/Users/gonpingy/project/dev/php/lib/Requester.php');

class BatchRequester {

  /**
   * 設定
   *
   * @var array
   */
  protected $config = array();

  /**
   * エラーフラグ
   *
   * @var array
   */
  protected $is_error_flag = false;

  /**
   * URL一覧
   *
   * @var array
   */
  protected $url_list = array();

  /**
   * コンストラクタ
   *
   * @return void
   */
  public function __construct() {
    $this->setConfig();
  }

  /**
   * ディレクトリ作成
   *
   * @param string $dir ディレクトリパス
   * @return void
   */
  protected function createDir($dir) {
    // ディレクトリがない場合
    if (is_dir($dir) === false) {
      // ディレクトリ作成成功の場合
      if (mkdir($dir, 0777, true)) {
        echo 'dir: ' . $dir . PHP_EOL;
      // ディレクトリ作成失敗の場合
      } else {
         $message = 'dir error: ' . $dir . PHP_EOL;

         echo $message;
         Logger::log($message);
      }
    }
  }

  /**
   * ファイル作成
   *
   * @param string $file ファイルパス
   * @param string $data ファイルに書き込むデータ
   * @return void
   */
  protected function createFile($file, $data) {
    // SJIS想定で文字コードをUTF-8に変換
    $data = mb_convert_encoding($data, 'UTF-8', 'SJIS');

    // 改行コードをUNIXに修正し、ファイル作成
    // 作成成功の場合
    if (file_put_contents($file, trim(str_replace("\r\n", PHP_EOL, $data))) !== false) {
      echo 'file: ' . $file . PHP_EOL;
    // 作成失敗の場合
    } else {
      $message = 'file error: ' . $file . PHP_EOL;
      
      echo $message;
      Logger::log($message);
    }
  }

  /**
   * 実行
   *
   * @return void
   */
  public function execute() {
    Logger::log('start: ' . get_class($this) . PHP_EOL);
    Logger::log('option: ' . var_export($this->config, true) . PHP_EOL);

    // URLリスト設定
    $this->setUrlList();

    // HTMLを保存
    $this->saveHTMLList();

    // エラーがあった場合
    if ($this->is_error_flag) {
      echo 'error!!' . PHP_EOL;
      Logger::log('error!!' . PHP_EOL);

      exit(1);
    }
  }

  /**
   * 設定
   *
   * @return void
   */
  public function setConfig() {
    $options = getopt('p:l:s:r:');

    $this->config = array(
      'prefecture' => array(),
      'line' => array()
    );

    // 都道府県IDが指定されている場合
    if (isset($options['p'])) {
      $this->config['prefecture'][] = $options['p'];
    // 路線IDが指定されている場合
    } else if (isset($options['l'])) {
      $this->config['line'] = array($options['l']);
    // ファイルが指定されている場合
    } else if (isset($options['f'])) {
    // 都道府県IDが指定されていない場合
    } else {
      // 全都道府県が対象
      $this->config['prefecture'] = array();

      for ($i = 1; $i < 48; $i++) {
        $this->config['prefecture'][] = sprintf('%02d', $i);
      }
    }

    // 開始インデックスが指定されている場合
    if (isset($options['s']) && is_numeric($options['s'])) {
      $this->config['start'] = $options['s'];
    // 開始インデックスが指定されていない場合
    } else {
      $this->config['start'] = START_DEFAULT;
    }

    // 取得件数が指定されている場合
    if (isset($options['r']) && is_numeric($options['r'])) {
      $this->config['results'] = $options['r'];
    // 取得件数が指定されていない場合
    } else {
      $this->config['results'] = RESULTS_DEFAULT;
    }
  }

  /**
   * HTMLを保存
   *
   * @return void
   */
  protected function saveHTMLList() {
    while ((count($this->url_list) / $this->config['results']) + 1 >= $this->config['start']) {
      Logger::log('index: ' . $this->config['start'] . PHP_EOL);

      // HTMLを取得
      $requester = new Requester(array_slice($this->url_list, ($this->config['start'] - 1) * $this->config['results'], $this->config['results']));
      $result = $requester->execute();

      // 結果数分ループ
      foreach ($result as $url => $response) {
        // HTTPリクエスト成功、コンテンツが空でない場合
        if ($response['status'] == 200 && $response['content'] != '') {
          // ファイル作成
          $this->createFile($this->getFilePath($url), $response['content']);
        // HTTPリクエスト失敗 or コンテンツが空の場合
        } else {
          echo 'failed: ' . $url . PHP_EOL;
          Logger::log('failed: ' . $url . PHP_EOL);

          $this->is_error_flag = true;
        }
      }

      $this->config['start']++;
    }
  }

  /**
   * 取得するURLを設定
   *
   * @return void
   */
  protected function setUrlList() {
  }
}
