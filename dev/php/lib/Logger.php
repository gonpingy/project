<?php
class Logger {

  private static  $config = array();

  public static function setConfig($config) {
    self::$config = $config;
  }

  public static function log($message) {
    error_log(date('YmdHis') . ':' . $message, 3, './log');
  }
}
