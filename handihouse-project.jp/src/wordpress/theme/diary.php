<?php
/*
* Template Name: diary
* */
$args = array(
  'nopaging' => true,
  'order' => 'desc',
  'orderby' => 'title',
  'post_parent' => 19, // worksページのID
  'post_type' => 'page'
);
$children = get_posts($args);
$i = 1;

// ヘッダ表示
get_header();

?>
<article id="works">
<h2>・交換日記</h2>
<ul>
<?php foreach ($children as $child): ?>
<?php if (get_field('diary_photo', $child->ID) !== false): ?>
<?php
  $li_class = $i % 3 === 1 ? ' class="left"' : '';
  $prefix = array(
    'design' => 'works_',
    'construction' => 'works_',
    'title' => 'works_'
  );

  foreach ($prefix as $key => $value) {
    if (get_field('works_' . $key, $child->ID) === false) {
      $prefix[$key] = '';
    }
  }
?>
<li id="<?php echo $child->post_title; ?>"<?php echo $li_class; ?>>
<div>
<a href="./exchangeDiary/<?php echo str_replace('work', '', $child->post_title); ?>/">
<img src="<?php the_field('diary_photo', $child->ID); ?>" alt="<?php the_field('title', $child->ID); ?>" />
</a>
</div>
<div class="information"><?php the_field('works_state', $child->ID); ?></div>
<dl class="<?php the_field('works_color', $child->ID); ?>">
<dt class="title"><?php echo str_replace('work', '', $child->post_title); ?></dt>
<dd class="title"><?php echo get_field($prefix['title'] . 'title', $child->ID); ?></dd>
<dt>設計</dt>
<dd><?php echo strip_tags(get_field($prefix['design'] . 'design', $child->ID)); ?></dd>
<dt>施工</dt>
<dd><?php echo strip_tags(get_field($prefix['construction'] . 'construction', $child->ID)); ?></dd>
</dl>
</li>
<?php $i++; ?>
<?php endif; ?>
<?php endforeach; ?>
</ul>
</article>
<?php
// フッタ表示
get_footer();
?>
