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
  <header id="common">
  <?php endif; ?>
  <?php // topページの場合 ?>
  <?php if (get_page_link() == get_bloginfo('home') . CLEAR_BANK_PATH_TOP): ?>
  <header id="top">
  <h1><a href="<?php echo get_bloginfo('home') . CLEAR_BANK_PATH_TOP; ?>"><img src="<?php echo get_bloginfo('template_url') . CLEAR_BANK_PATH_IMAGE; ?>/top_logo.png" alt="Clear Bank CO., LTD."/></a></h1>
  <h2>Clear Bank CO., LTD.</h2> 
  <?php // topページ以外の場合 ?>
  <?php else: ?>
  <h1><a href="<?php echo get_bloginfo('home') . CLEAR_BANK_PATH_TOP; ?>"><img src="<?php echo get_bloginfo('template_url') . CLEAR_BANK_PATH_IMAGE; ?>/logo.gif" alt="Clear Bank CO., LTD."/></a></h1>
  <?php endif; ?>
    <nav>
      <ul id="menu">
        <li id="about"><a href="<?php echo get_bloginfo('home') . CLEAR_BANK_PATH_ABOUT; ?>">企業情報</a></li>
        <li id="personal"><a href="<?php echo get_bloginfo('home') . CLEAR_BANK_PATH_PERSONAL; ?>">個人のお客様</a></li>
        <li id="compliance"><a href="<?php echo get_bloginfo('home') . CLEAR_BANK_PATH_COMPLIANCE; ?>">コンプライアンス</a></li>
        <!--
        <li><a href="./corporate.html">企業情報</a></li>
        <li><a href="./faq.html">よくあるご質問</a></li>
        -->
      </ul>
      <?php // topページの場合 ?>
      <?php if (get_page_link() == get_bloginfo('home') . CLEAR_BANK_PATH_TOP): ?>
      <div id="subMenu">
        <ul id="subabout">
          <li><a href="<?php echo get_bloginfo('home') . CLEAR_BANK_PATH_ABOUT; ?>#scope">事業紹介</a></li>
          <li><a href="<?php echo get_bloginfo('home') . CLEAR_BANK_PATH_ABOUT; ?>#company">本社・支店のご案内</a></li>
          <li><a href="<?php echo get_bloginfo('home') . CLEAR_BANK_PATH_ABOUT; ?>#concept">企業理念</a></li>
          <li><a href="<?php echo get_bloginfo('home') . CLEAR_BANK_PATH_ABOUT; ?>#greeting">代表挨拶</a></li>
          <li><a href="<?php echo get_bloginfo('home') . CLEAR_BANK_PATH_ABOUT; ?>#promise">お客様とのお約束</a></li>
        </ul>
        <ul id="subpersonal">
          <li><a href="<?php echo get_bloginfo('home') . CLEAR_BANK_PATH_PERSONAL; ?>#investment">資産運用について</a></li>
          <li><a href="<?php echo get_bloginfo('home') . CLEAR_BANK_PATH_PERSONAL; ?>#instrument">商品のご紹介</a></li>
          <li><a href="<?php echo get_bloginfo('home') . CLEAR_BANK_PATH_PERSONAL; ?>#merit">7つのメリット</a></li>
        </ul>
        <ul id="subcompliance">
          <li><a href="<?php echo get_bloginfo('home') . CLEAR_BANK_PATH_COMPLIANCE; ?>#about">コンプライアンスとは</a></li>
          <li><a href="<?php echo get_bloginfo('home') . CLEAR_BANK_PATH_COMPLIANCE; ?>#rule">主なお客様保護のルール</a></li>
          <li><a href="<?php echo get_bloginfo('home') . CLEAR_BANK_PATH_COMPLIANCE; ?>#promise">各種届け出</a></li>
        </ul>
      </div>
      <?php endif; ?>
    </nav>
  </header>
