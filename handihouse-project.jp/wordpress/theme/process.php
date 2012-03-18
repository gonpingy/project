<?php
/*
* Template Name: process
*/
// ヘッダ表示
get_header();
?>
<article id="process">
<?php
// コンテンツ表示
// the_contentを使うにはthe_postを先に使う必要あり
the_post();
the_content();
?>
</article>
<script>
$(function() {
  // スライドショー
  $('ul li div a').fancybox({
    'centerOnScroll': true,
    'showNavArrows': true
  });
});
</script>
<?php
// フッタ表示
get_footer();
?>
