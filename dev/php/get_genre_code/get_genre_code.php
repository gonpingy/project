<?php
// 業種マスター一覧取得
// http://developer.yahoo.co.jp/webapi/map/openlocalplatform/v1/genreCode.html

/** 
 * このブログのまま
 * http://techblog.yahoo.co.jp/cat209/api1_curl_multi/
 * 複数URLのコンテンツ、及び通信ステータスを一括取得する。 
 */
function getMultiContents($url_list) {
  // マルチハンドルの用意
  $mh = curl_multi_init();

  // URLをキーとして、複数のCurlハンドルを入れて保持する配列
  $ch_list = array();

  // Curlハンドルの用意と、マルチハンドルへの登録  
  foreach ($url_list as $url) {
      $ch_list[$url] = curl_init($url);
      curl_setopt($ch_list[$url], CURLOPT_RETURNTRANSFER, TRUE);
      curl_setopt($ch_list[$url], CURLOPT_TIMEOUT, 1);  // タイムアウト秒数を指定
      curl_multi_add_handle($mh, $ch_list[$url]);
  }

  // 一括で通信実行、全て終わるのを待つ  
  $running = null;
  do {
    curl_multi_exec($mh, $running);
  } while ($running);

  // 実行結果の取得
  foreach ($url_list as $url) {
      // ステータスとコンテンツ内容の取得
      $results[$url] = curl_getinfo($ch_list[$url]);
      $results[$url]["content"] = curl_multi_getcontent($ch_list[$url]);

      // Curlハンドルの後始末
      curl_multi_remove_handle($mh, $ch_list[$url]);
      curl_close($ch_list[$url]);
  }

  // マルチハンドルの後始末
  curl_multi_close($mh);

  // 結果返却
  return $results;
}

// URLから業種コード取得
function getGenreCode($url_list) {
  $result = getMultiContents($url_list);
 var_dump ( $result ); 
  foreach ($result as $key => $value) {
    $json = json_decode($value['content']);
  
    foreach ($json->Feature as $feature) {
      $genre[$feature->Id] = $feature->Name;
      $query['gc'] = $feature->Id;
    }
  }

  return $genre;
}

define(DATA_DIR, './data');
define(DATA_FILE, DATA_DIR . '/genre_code.tsv');
define(APPID, 'QuQSFHexg66br_VgYSP5Qdj0Vhty2WiKWq6iUNtRZ0eKWtCJzepA9IwTcgctCknntHFx');
define(BASE_URL,  'http://category.search.olp.yahooapis.jp/OpenLocalPlatform/V1/genreCode');

$query = array(
  'appid' => APPID,
  'gc' => '',
  'output' => 'json'
);

// 第1階層の業種コード取得
$url_list = array(BASE_URL . '?' . http_build_query($query));
$genre1 = getGenreCode($url_list);

// 第2階層の業種コード取得
$url_list = array();

foreach ($genre1 as $gc => $name) {
  $query['gc'] = $gc;
  $url_list[] = BASE_URL . '?' . http_build_query($query);
}

$genre2 = getGenreCode($url_list);
var_dump ( $genre2 );
// 第3階層の業種コード取得
$url_list = array();

foreach ($genre2 as $gc => $name) {
  $query['gc'] = $gc;
  $url_list[] = BASE_URL . '?' . http_build_query($query);
}

$genre3 = getGenreCode($url_list);

// 全てをまとめてTSV出力
$genre = array_merge($genre1, $genre2, $genre3);
ksort($genre, SORT_STRING);
$tsv = '';

foreach ($genre as $gc => $name) {
  $tsv .= $gc . "\t" . $name . PHP_EOL;
}

file_put_contents(DATA_FILE, $tsv);
?>
