<?php
require_once('/Users/gonpingy/project/dev/php/request_ekikara/batch.php');

class LineListRequester extends BatchRequester {

  function setUrlList() {
    $url_list = array();

    // 都道府県ディレクトリ作成
    $this->createDir(DIR_PREFECTURE);

    // 都道府県数分ループ
    for ($i = 1; $i < 48; $i++) {
      $prefecture_id = sprintf('%02d', $i);
      $url_list[$prefecture_id] = 'http://ekikara.jp/newdata/state/line/' . $prefecture_id . '.htm';
    }
    
    $this->url_list = $url_list;
  }

  protected function getFilePath($url) {
    preg_match('/([0-9]{2})/', $url, $matches);
    
    return DIR_PREFECTURE . '/' . sprintf('%02d', $matches[0]) . '.html';
  }
}

$line_list = new LineListRequester();
$line_list->execute();
