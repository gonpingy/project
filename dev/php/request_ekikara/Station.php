<?php
require_once('/Users/gonpingy/project/dev/php/request_ekikara/batch.php');

class StationRequester extends BatchRequester {

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

    // URLを設定
    $this->url_list = $url_list;
  }

  public function setUrlListByLineId($line_id) {
    try {
      $line = json_decode(file_get_contents(DIR_LINE . '/' . $line_id . '/line.html.json'));
      $url_list = array();

      // 駅ディレクトリ作成
      $this->createDir(DIR_STATION);

      // 駅数分ループ
      foreach ($line->station as $station) {
        $url_list[] = $station->uri;
      }
    } catch (Exception $e) {
      Logger::log(__METHOD__ . ' error: ' . $line_id);
    }

    return $url_list;
  }

  protected function getFilePath($url) {
    preg_match('/^.*station\/(.*)\.htm$/', $url, $matches);
    
    return DIR_STATION . '/' . $matches[1] . '.html';
  }
}

$track = new StationRequester();
$track->execute();
