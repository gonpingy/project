<?php
/*
 * Template Name: blog
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
<article id="blog" class="blog">
<h2>・blog</h2>
<aside>
<?php get_sidebar(); ?>
</aside>
<?php // 投稿がある場合 ?>
<?php $i = 0; ?>
<?php if(have_posts()): ?>
<?php // 投稿数分ループ ?>
<?php while (have_posts()): ?>
<?php the_post(); ?>
<?php // 2番目以降ボーダー表示する ?>
<?php if ($i != 0): ?>
<?php // 初めはボーダー表示しない ?>
<div class="hr"></div>
<article>
<?php else: ?>
<article class="first">
<?php endif; ?>
<?php $i++; ?>
<header>
<h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
</header>
<section>
<?php the_content(); ?>
</section>
<footer>
<ul>
<li><?php the_time('Y.m.d'); ?></li>
<li><?php the_category(', '); ?></li>
<li><a href="<?php the_permalink(); _e('#comment');?>"><?php comments_number('コメント (0)', 'コメント (1)', 'コメント (%)'); ?></a></li>
<li><div class="fb-like" data-href="<?php the_permalink(); ?>" data-send="false" data-layout="button_count" data-width="450" data-show-faces="false"></div></li>
</ul>
</footer>
</article>
<?php endwhile; ?>
<nav>
<span id="old"><?php previous_posts_link('<< newer entries'); ?></span>
<span id="next"><?php next_posts_link('older entries >>'); ?></span>
</nav>
<?php // 投稿がない場合 ?>
<?php else: ?>
<?php endif; ?>
</article>
<?php
// フッタ表示
get_footer();
?>
