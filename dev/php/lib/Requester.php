<?php
/** 
 * HTTPリクエストを実行する
 */
class Requester {

  /**
   * URLリスト
   *
   * @param array
   */
  private $_url_list = array();

  /**
   * コンストラクタ
   *
   * @param array URLリスト
   */
  function __construct($url_list) {
      $this->_url_list = $url_list;
  }

  /**
   * このブログのまま
   * http://techblog.yahoo.co.jp/cat209/api1_curl_multi/
   * 複数URLのコンテンツ、及び通信ステータスを一括取得する。 
   *
   * @return array HTTPリクエスト結果
   */
  public function execute() {
    // マルチハンドルの用意
    $mh = curl_multi_init();

    // URLをキーとして、複数のCurlハンドルを入れて保持する配列
    $ch_list = array();
    $result_list = array();

    // Curlハンドルの用意と、マルチハンドルへの登録  
    while (count($this->_url_list) > 0) {
      $url = array_shift($this->_url_list);
      $ch_list[$url] = curl_init($url);  
      curl_setopt($ch_list[$url], CURLOPT_RETURNTRANSFER, TRUE);  
      curl_setopt($ch_list[$url], CURLOPT_TIMEOUT, 1);  // タイムアウト秒数を指定  
      curl_multi_add_handle($mh, $ch_list[$url]);  
  
      if (count($ch_list) == 10 || count($this->_url_list) == 0) {
        // 一括で通信実行、全て終わるのを待つ  
        $running = null;  

        do {
          curl_multi_exec($mh, $running);
        } while ($running);  
  
        // 実行結果の取得  
        foreach($ch_list as $url => $ch) {  
          // ステータスとコンテンツ内容の取得  
          $result_list[$url] = array();
          $result_list[$url]['status'] = curl_getinfo($ch, CURLINFO_HTTP_CODE);  
          $result_list[$url]['content'] = curl_multi_getcontent($ch);
  
          // Curlハンドルの後始末  
          curl_multi_remove_handle($mh, $ch);
          curl_close($ch);
        }  

        $ch_list = array();
      } 
    }

    // マルチハンドルの後始末  
    curl_multi_close($mh);  

    // 結果返却  
    return $result_list;  
  }
}
?>
