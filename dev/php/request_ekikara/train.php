<?php
require_once('/Users/gonpingy/project/dev/php/request_ekikara/batch.php');

class TrainRequester extends BatchRequester {

  protected function getFilePath($url) {
    preg_match('/^.*detail\/([0-9]+)\/([0-9]*).htm$/', $url, $matches);

    return DIR_LINE . '/' . $matches[1] . '/train/' . $matches[2] . '.html';
  }

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

    // 都道府県数分ループ
    foreach ($this->config['line'] as $line_id) {
      $url_list = array_merge($url_list, $this->setUrlListByLineId($line_id));
    }

    // URLを設定
    $this->url_list = $url_list;
  }

  /**
   * 路線ID
   *
   * @return void
   */
  public function setUrlListByLineId($line_id) {
    $dir = DIR_LINE . '/' . $line_id;
    $day = array(
      '' => 'weekday',
      '_sat' => 'saturday',
      '_holi' => 'holiday',
    );
    $line = json_decode(file_get_contents($dir . '/line.html.json'));

    // 電車ディレクトリ作成
    $this->createDir($dir . '/train');
    
    // 行き先数分ループ
    foreach ($line->line->track as $key => $track) {
      $dir_track = $dir . '/' . $key;
    
      // 平日、土曜、休日
      foreach (array_keys($day) as $value) {
        $track_list = json_decode(file_get_contents($dir_track . '/' . $day[$value] . '/trackList.html.json'));
    
        foreach ($track_list->track as $key => $track) {
          $train_list = json_decode(file_get_contents($dir_track . '/' . $day[$value] . '/' . $key . '.html.json'));

          // 電車数分ループ
          foreach ($train_list->train as $key => $train) {
            $url_list[] = $train->uri;
          }
        }
      }
    }

    return $url_list;
  }
}

$track = new TrainRequester();
$track->execute();
