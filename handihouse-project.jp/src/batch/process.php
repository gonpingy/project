<?php
require_once('./Requester.php');

$text = 'process_14_';
$photo_list = getPhotoList($text);
generateProcess($photo_list);

function getPhotoList($text) {
  $query = array(
    'method' => 'flickr.photos.search',
    'api_key' => '83fbd100f73d89e031214e37686e10bf',
    'user_id' => '73139181@N06',
    'text' => $text,
    'format' => 'json',
  );
  $api = 'http://api.flickr.com/services/rest/';
  $url_list = array($api . '?' . http_build_query($query));

  $requester = new Requester($url_list);
  $result = array_pop($requester->execute());

  echo sprintf('photo list status %d' . PHP_EOL, $result['status']);

  if ($result['status'] == 200) {
    $data = str_replace('jsonFlickrApi(', '', $result['content']);
    $data = json_decode(substr($data, 0, strlen( $data ) - 1), true);
var_dump($data);
    $url_list = array();
    $query = array(
      'method' => 'flickr.photos.getInfo',
      'api_key' => '83fbd100f73d89e031214e37686e10bf',
      'user_id' => '73139181@N06',
      'format' => 'json',
    );
    $api = 'http://api.flickr.com/services/rest/';

    foreach ($data['photos']['photo'] as $photo) {
      $query['photo_id'] = $photo['id'];
      $url_list[] = $api . '?' . http_build_query($query);
    }

    $requester->setUrlList($url_list);
    $result_list = $requester->execute();
    $photo_list = array();

    foreach ($result_list as $url => $result) { 
      echo sprintf('photo %s status %d' . PHP_EOL, $url, $result['status']);

      if ($result['status'] == 200) {
        $data = str_replace('jsonFlickrApi(', '', $result['content']);
        $data = json_decode(substr($data, 0, strlen($data) - 1), true);
        $photo_list[$data['photo']['title']['_content']] = $data['photo'];
      } else {
        echo 'photo error' . PHP_EOL;
      }
    }

    return $photo_list;
  } else {
    exit(1);
  }
}

function getPhoto($photo_id) {
  $query = array(
    'method' => 'flickr.photos.getInfo',
    'api_key' => 'c806824b8b8a90d0752bbc6052d708eb',
    'photo_id' => $photo_id,
    'user_id' => '73139181@N06',
    'format' => 'php_serial',
  );
  $api = 'http://api.flickr.com/services/rest/';
  $url_list = array($api . '?' . http_build_query($query));

  $requester = new Requester($url_list);
  $result = array_pop($requester->execute());

  if ($result['status'] == 200) {
    return unserialize($result['content']);
  } else {
    echo 'process list error' . PHP_EOL;

    exit(1);
  }
}

function generateProcess($photo_list) {
  $i = 0;
  $template = "<li%s>\n" .
    "<div>\n" .
    "<a title=\"%s\" rel=\"process\" href=\"%s\">\n" .
    "<img src=\"%s\" alt=\"%s\" />\n" .
    "</a>\n" .
    "</div>\n" .
    "<p>%s</p>\n" .
    "</li>\n";

  
  uasort($photo_list, 'compareTitleContent');

  echo '<ul>' . PHP_EOL;

  foreach ($photo_list as $photo) {
    $class = ($i + 1) % 3 === 1 ? ' class="left"' : '';
    $url = sprintf('http://farm%s.staticflickr.com/%s/%s_%s.jpg', $photo['farm'], $photo['server'], $photo['id'], $photo['secret']);
    $note = rtrim($photo['description']['_content']);

    echo sprintf($template, $class, $note, $url, $url, $note, $note);
    $i++;
  }

  echo '</ul>' . PHP_EOL;
}

function compareTitleContent($a, $b) {
  if ($a['title']['_content'] < $b['title']['_content']) {
    return -1;
  } else {
    return 1;
  }
}
