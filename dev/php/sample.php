<?php
require_once('/Users/gonpingy/project/dev/php/lib/Requester.php');
require_once('/Users/gonpingy/project/dev/php/lib/Logger.php');
echo base64_encode('下北沢駅');
//
$requester = new Requester(array('http://ekikara.jp/newdata/line/0101023.htm'));
$result = $requester->execute();
var_dump ( $result);
var_dump ( 123);
//Logger::setConfig(array('path' => './aaa'))
Logger::log('asdfasfd');
