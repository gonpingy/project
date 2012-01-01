<?php
/*
 * Template Name: contact
 */
// ヘッダ表示
get_header();
?>
<article id="contact">
<h2>・contact</h2>
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
