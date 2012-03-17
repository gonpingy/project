<?php
/*
 * Template Name: Clear Bank
 */
// ヘッダ表示
get_header();

// コンテンツ表示
// the_contentを使うにはthe_postを先に使う必要あり
the_post();
the_content();

// フッタ表示
get_footer();
?>
