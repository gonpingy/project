<?php
/**
 * ヘッダ
 *
 * @package WordPress
 * @subpackage Clear Bank
 */
// 設定ファイル読み込み
require_once(get_template_directory() . '/config.php');
?>
<!DOCTYPE html>
<html lang="ja" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="keywords" content="Clear Bank,クリアバンク" />
  <title>Clear Bank CO., LTD.</title>
  <!-- リセットCSS http://html5doctor.com/html-5-reset-stylesheet/ -->
  <link rel="stylesheet" href="<?php echo get_bloginfo('template_url') . CLEAR_BANK_PATH_CSS; ?>/html5reset-1.6.1.css" />
  <link rel="stylesheet" href="<?php echo get_bloginfo('template_url') . CLEAR_BANK_PATH_CSS; ?>/clearbank.css" />
  <link href="http://www.clear-bank.jp/wp-content/themes/clear-bank.jp/favicon.ico" rel="shortcut icon">
  <?php // トップページの場合 ?>
  <?php if (get_page_link() == get_bloginfo('home') . CLEAR_BANK_PATH_TOP): ?>
  <link rel="stylesheet" href="<?php echo get_bloginfo('template_url') . CLEAR_BANK_PATH_CSS; ?>/index.css" />
  <?php // personalページの場合 ?>
  <?php elseif (get_page_link() == get_bloginfo('home') . CLEAR_BANK_PATH_PERSONAL): ?>
  <link rel="stylesheet" href="<?php echo get_bloginfo('template_url') . CLEAR_BANK_PATH_CSS; ?>/personal.css" />
  <?php // beginnerページの場合 ?>
  <?php elseif (get_page_link() == get_bloginfo('home') . CLEAR_BANK_PATH_BEGINNER): ?>
  <link rel="stylesheet" href="<?php echo get_bloginfo('template_url') . CLEAR_BANK_PATH_CSS; ?>/beginner.css" />
  <?php // complianceページの場合 ?>
  <?php elseif (get_page_link() == get_bloginfo('home') . CLEAR_BANK_PATH_COMPLIANCE): ?>
  <?php // aboutページの場合 ?>
  <?php elseif (get_page_link() == get_bloginfo('home') . CLEAR_BANK_PATH_ABOUT): ?>
  <link rel="stylesheet" href="<?php echo get_bloginfo('template_url') . CLEAR_BANK_PATH_CSS; ?>/about.css" />
  <?php endif; ?>
  <!--[if lt IE 9]>
  <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
  <![endif]-->
</head>
<body>
  <?php // topページ以外の場合 ?>
  <?php if (get_page_link() != get_bloginfo('home') . CLEAR_BANK_PATH_TOP): ?>
  <div id="brochure"><img src="<?php echo get_bloginfo('template_url') . CLEAR_BANK_PATH_IMAGE; ?>/brochure.gif" /></div>
  <?php endif; ?>
  <header>
  <h1><a href="<?php echo get_bloginfo('home') . CLEAR_BANK_PATH_TOP; ?>"><img src="<?php echo get_bloginfo('template_url') . CLEAR_BANK_PATH_IMAGE; ?>/logo.gif" alt="Clear Bank CO., LTD."/></a></h1>
    <nav>
      <ul>
        <li id="personal"><a href="<?php echo get_bloginfo('home') . CLEAR_BANK_PATH_PERSONAL; ?>">個人のお客様</a></li>
        <li id="beginner"><a href="<?php echo get_bloginfo('home') . CLEAR_BANK_PATH_BEGINNER; ?>">初めての資産運用</a></li>
        <li id="compliance"><a href="<?php echo get_bloginfo('home') . CLEAR_BANK_PATH_COMPLIANCE; ?>">コンプライアンス</a></li>
        <li id="about"><a href="<?php echo get_bloginfo('home') . CLEAR_BANK_PATH_ABOUT; ?>">Clear Bankについて</a></li>
        <!--
        <li><a href="./corporate.html">企業情報</a></li>
        <li><a href="./faq.html">よくあるご質問</a></li>
        -->
      </ul>
    </nav>
  </header>
