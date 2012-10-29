<?php
/**
 * ヘッダ
 *
 * @package WordPress
 * @subpackage HandiHouse
 */
// 設定ファイル読み込み
require_once(get_template_directory() . '/config.php');
?>
<!DOCTYPE html>
<html lang="ja" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="keywords" content="HandiHouse Project,HandiHouse,坂田裕貴,cacco design studio,中田裕一,中田製作所,加藤渓一,studio PEACE sign,荒木伸哉,サウノル製作所,ハンディハウスプロジェクト,ハンディハウス,はんでぃはうす" />
  <title>HandiHouse Project</title>
  <!-- リセットCSS http://html5doctor.com/html-5-reset-stylesheet/ -->
  <link rel="stylesheet" href="<?php echo get_bloginfo('template_url') . H2PJ_PATH_CSS; ?>/html5reset-1.6.1.css" />
  <link rel="stylesheet" href="<?php echo get_bloginfo('template_url') . H2PJ_PATH_CSS; ?>/h2pj.css" />
  <?php // 固定ページの場合 ?>
  <?php if (is_page()): ?>
  <link rel="stylesheet" href="<?php echo get_bloginfo('template_url') . H2PJ_PATH_CSS . '/' .  str_replace('php', 'css', array_pop(explode('/', get_page_template()))); ?>" />
  <?php // ブログページの場合 ?>
  <?php else: ?>
  <link rel="alternate" type="application/rss+xml" title="HandiHouse Project Blog" href="<?php _e(get_bloginfo('home') . H2PJ_PATH_BLOG); ?>/feed/" />
  <link rel="stylesheet" href="<?php echo get_bloginfo('template_url') . H2PJ_PATH_CSS; ?>/blog.css" />
  <?php endif; ?>
  <link rel="shortcut icon" href="<?php echo get_bloginfo('template_url'); ?>/favicon.ico" />
  <!--[if lt IE 9]>
  <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
  <![endif]-->
  <!-- jQuery http://jquery.com/ -->
  <script src="<?php echo get_bloginfo('template_url') . H2PJ_PATH_JS; ?>/jquery-1.7.1.min.js"></script>
  <script src="<?php echo get_bloginfo('template_url') . H2PJ_PATH_JS; ?>/fancybox/jquery.fancybox-1.3.4.pack.js"></script>
  <link rel="stylesheet" href="<?php echo get_bloginfo('template_url') . H2PJ_PATH_JS; ?>/fancybox/jquery.fancybox-1.3.4.css" />
  <!-- Google Analytics -->
  <script type="text/javascript">
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-28024983-1']);
    _gaq.push(['_trackPageview']);
  
    (function() {
      var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
      ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
  </script>
</head>
<body>
  <header>
    <hgroup>
      <ul>
        <li><h1 class="handihouse left">HandiHouse project</h1></li>
        <?php // topの場合 ?>
        <?php if (is_front_page()): ?>
        <li><span id="delimiter">|</span></li>
        <li><h1><a href="<?php echo get_bloginfo('home') . H2PJ_PATH_ABOUT; ?>">Enter</a></h1></li>
        <?php endif; ?>
      </ul>
    </hgroup>
    <div class="hr"></div>
    <?php // top以外の場合 ?>
    <?php if (is_front_page() === false): ?>
    <nav>
      <ul>
        <?php
          $list_class = array(
            'about' => '',
            'profile' => '',
            'works' => '',
            'diary' => '',
            'blog' => '',
            'contact' => ''
          );

          // aboutの場合
          if (in_array(get_page_link(), array(get_bloginfo('home') . H2PJ_PATH_ABOUT, get_bloginfo('home') . H2PJ_PATH_ABOUT_CONCEPT, get_bloginfo('home') . H2PJ_PATH_ABOUT_WORK_FLOW, get_bloginfo('home') . H2PJ_PATH_ABOUT_WORKSHOP))) {
            $list_class['about'] = ' class="handihouse"';
          // profileページの場合
          } else if (get_page_link() == get_bloginfo('home') . H2PJ_PATH_PROFILE) {
            $list_class['profile'] = ' class="handihouse"';
          // worksページの場合
          } else if (strpos(get_permalink(), get_bloginfo('home') . H2PJ_PATH_WORKS) !== false) {
            $list_class['works'] = ' class="handihouse"';
          // diaryページの場合
          } else if (get_page_link() == get_bloginfo('home') . H2PJ_PATH_DIARY) {
            $list_class['diary'] = ' class="handihouse"';
          // blogページの場合
          } else if (strpos(get_permalink(), get_bloginfo('home') . H2PJ_PATH_BLOG) !== false) {
            $list_class['blog'] = ' class="handihouse"';
          // contactページの場合
          } else if (get_page_link() == get_bloginfo('home') . H2PJ_PATH_CONTACT) {
            $list_class['contact'] = ' class="handihouse"';
          }
        ?>
        <li><a href="<?php echo get_bloginfo('home') . H2PJ_PATH_ABOUT; ?>"<?php echo $list_class['about']; ?>>about</a></li>
        <li><a href="<?php echo get_bloginfo('home') . H2PJ_PATH_PROFILE; ?>"<?php echo $list_class['profile']; ?>>profile</a></li>
        <li><a href="<?php echo get_bloginfo('home') . H2PJ_PATH_WORKS; ?>"<?php echo $list_class['works']; ?>>works</a></li>
        <li><a href="<?php echo get_bloginfo('home') . H2PJ_PATH_DIARY; ?>"<?php echo $list_class['diary']; ?>>exchange diary</a></li>
        <li><a href="<?php echo get_bloginfo('home') . H2PJ_PATH_BLOG; ?>"<?php echo $list_class['blog']; ?>>blog</a></li>
        <li><a href="<?php echo get_bloginfo('home') . H2PJ_PATH_CONTACT; ?>"<?php echo $list_class['contact']; ?>>contact</a></li>
      </ul>
    </nav>
    <?php endif; ?>
  </header>
