<?php
/*
 * Template Name: single
 */
// ヘッダ表示
get_header();
?>
<div id="fb-root"></div>
<script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/ja_JP/all.js#xfbml=1&appId=136567683098228";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>
<article id="article" class="blog">
<h2>・blog</h2>
<aside>
<?php get_sidebar(); ?>
</aside>
<?php the_post(); ?>
<article>
<header>
<h3><?php the_title(); ?></h3>
</header>
<section>
<?php the_content(); ?>
</section>
<footer>
<ul>
<li><?php the_time('Y.m.d'); ?></li>
<li><?php the_category(', '); ?></li>
<li><?php comments_number('コメント (0)', 'コメント (1)', 'コメント (%)'); ?></li>
<li><div class="fb-like" data-href="<?php the_permalink(); ?>" data-send="false" data-layout="button_count" data-width="450" data-show-faces="false"></div></li>
</ul>
</footer>
<aside id="comment">
<?php comments_template(); ?>
</aside>
</article>
</article>
<?php
// フッタ表示
get_footer();
?>
