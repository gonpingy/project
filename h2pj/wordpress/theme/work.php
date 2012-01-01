<?php
/*
* Template Name: work
*/
// ヘッダ表示
get_header();
?>
<article id="work">
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
  // クリックしたサムネイルを大きく表示
  $('#thumbnail ul li img').bind('click', function() {
    var index = $('#thumbnail ul li img').index(this);
    $($('div.photo').hide().get(index)).show();
  });
})();
</script>
<?php
// フッタ表示
get_footer();
?>
