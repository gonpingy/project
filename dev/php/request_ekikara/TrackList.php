<?php
require_once('/Users/gonpingy/project/dev/php/request_ekikara/batch.php');

class TrackListRequester extends BatchRequester {

  public function setUrlList() {
    $url_list = array();
    $day = array(
      '' => 'weekday',
      '_sat' => 'saturday',
      '_holi' => 'holiday',
    );

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
      $day = array(
        '' => 'weekday',
        '_sat' => 'saturday',
        '_holi' => 'holiday',
      );
      $line = json_decode(file_get_contents(DIR_LINE . '/' . $line_id . '/line.html.json'));
      $url_list = array();

      // 行き先数分ループ
      foreach ($line->line->track as $key => $track) {
        // 平日、土曜、休日
        foreach (array_keys($day) as $value) {
          $url_list[] = str_replace('.htm', $value . '.htm', $track->uri);
      
          // 行き先ディレクトリ作成
          $this->createDir(DIR_LINE . '/' . $line_id . '/' . $key . '/' . $day[$value]);
        }
      }
    } catch (Exception $e) {
      Logger::log(__METHOD__ . ' error: ' . $line_id);
    }

    return $url_list;
  }

  protected function getFilePath($url) {
    $day = array(
      '' => 'weekday',
      '_sat' => 'saturday',
      '_holi' => 'holiday',
    );

    preg_match('/^.*line\/(.*)\/(.*)1_1(.*).htm$/', $url, $matches);
    
    return DIR_LINE . '/' . $matches[1] . '/' . $matches[2] . '/' . $day[$matches[3]] . '/trackList.html';
  }
}

$track = new TrackListRequester();
$track->execute();
