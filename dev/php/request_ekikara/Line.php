<?php
require_once('/Users/gonpingy/project/dev/php/request_ekikara/batch.php');

class LineRequester extends BatchRequester {

  public function setUrlList() {
    $url_list = array();

    // 都道府県数分ループ
    foreach ($this->config['prefecture'] as $prefecture_id) {
      $line_list = json_decode(file_get_contents(DIR_PREFECTURE . '/' . $prefecture_id . '.html.json'));

      // 路線数分ループ
      foreach ($line_list->line as $line_id => $line) {
        $url_list = array_merge($url_list, $this->setUrlListByLineId($line_id));
      }
    }

    // 路線数分ループ
    foreach ($this->config['line'] as $line_id) {
      $url_list = array_merge($url_list, $this->setUrlListByLineId($line_id));
    }

    $this->url_list = $url_list;
  }

  public function setUrlListByLineId($line_id) {
    $dir = DIR_LINE . '/' . $line_id;
    
    // 路線ディレクトリ作成
    $this->createDir($dir);

    $url_list = array('http://ekikara.jp/newdata/line/' . $line_id . '.htm');

    return $url_list;
  }

  protected function getFilePath($url) {
    preg_match('/^.*line\/(.*)\.htm$/', $url, $matches);
    $line_id = $matches[1];
    
    return DIR_LINE . '/' . $line_id . '/line.html';
  }
}

$line = new LineRequester();
$line->execute();
