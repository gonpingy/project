<?php
/*
 * Template Name: enter
 */
// ヘッダ表示
get_header();
?>
<article id="enter">
<?php
// コンテンツ表示
// the_contentを使うにはthe_postを先に使う必要あり
the_post();
the_content();
?>
</article>
<script>
// window.onload
(function() {
  // ランダムに画像を表示
  photoList = $('div.photo');
  photoList.get(Math.floor(Math.random() * photoList.size())).style.display = 'block';
})();
</script>
<?php
// フッタ表示
get_footer();
?>
