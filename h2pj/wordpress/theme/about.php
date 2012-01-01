<?php
/*
 * Template Name: about
 */
// ヘッダ表示
get_header();
?>
<article class="about">
<h2>・about</h2>
<aside class="about">
<div class="hr"></div>
<?php
$list_class = array(
  'about' => '',
  'workflow' => '',
  'workshop' => ''
);

// aboutの場合
if (get_page_link() == get_bloginfo('home') . H2PJ_PATH_ABOUT) {
  $list_class['about'] = ' class="handihouse"';
// workflowの場合
} else if (get_page_link() == get_bloginfo('home') . H2PJ_PATH_ABOUT_WORK_FLOW) {
  $list_class['workflow'] = ' class="handihouse"';
// workshopの場合
} else if (get_page_link() == get_bloginfo('home') . H2PJ_PATH_ABOUT_WORKSHOP) {
  $list_class['workshop'] = ' class="handihouse"';
}
?>
<ul>
<li><a href="<?php echo get_bloginfo('home') . H2PJ_PATH_ABOUT; ?>"<?php echo $list_class['about']; ?>>concept</a></li>
<li><a href="<?php echo get_bloginfo('home') . H2PJ_PATH_ABOUT_WORK_FLOW; ?>"<?php echo $list_class['workflow']; ?>>work flow</a></li>
<li><a href="<?php echo get_bloginfo('home') . H2PJ_PATH_ABOUT_WORKSHOP; ?>"<?php echo $list_class['workshop']; ?>>workshop menu</a></li>
</ul>
<div class="hr"></div>
</aside>
<?php
// コンテンツ表示
// the_contentを使うにはthe_postを先に使う必要あり
the_post();
the_content();
?>
</article>
<?php
// フッタ表示
get_footer();
?>
