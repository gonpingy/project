<?php
/*
* Template Name: work
*/
// 詳細ページない場合はworksへリダイレクト
if (get_field('works_link_flag') === false) {
  header('Location: ../');
  exit(0);
}

// ヘッダ表示
get_header();
$id = the_title('', '', false);
?>
<article id="work">
<h2>・<?php echo str_replace('work', '', $id); ?> <?php the_field('title'); ?></h2>

<aside>

<div class="hr"></div>

<dl>
  <?php
    $fields = array(
      'design' => array(
        'label' => '設計',
        'required' => true
      ),
      'web' => array(
        'label' => 'WEB・グラフィック',
        'required' => false
      ),
      'construction' => array(
        'label' => '施工',
        'required' => true
      ),
      'period' => array(
        'label' => '期間',
        'required' => true
      ),
      'location' => array(
        'label' => '場所',
        'required' => true
      ),
      'area' => array(
        'label' => '面積',
        'required' => true
      ),
      'work' => array(
        'label' => '工事', 
        'required' => false
      ),
      'link' => array(
        'label' => 'リンク',
        'required' => false
      ),
    );
  ?>
  <?php foreach ($fields as $key => $value): ?>
  <?php if ($value['required'] === true || get_field($key) !== false): ?>
  <dt><?php echo $value['label']; ?></dt>
  <dd><?php echo nl2br(get_field($key)); ?></dd>
  <?php endif; ?>
  <?php endforeach; ?>
</dl>

<div class="hr"></div>

<?php if (get_field('process_link_flag') === true): ?>
<p>・工事中の写真は<a class="handihouse" href="./process/">こちら</a>から</p>
<?php endif; ?>
</aside>

<section>

<?php // 画像一覧 ?>
<?php for ($i = 1; $i <= 8; $i++): ?>
<?php if(get_field('photo' . $i) !== false): ?>
<div class="photo"><img src="<?php the_field('photo' . $i); ?>" alt="<?php the_field('title'); ?>" /></div>
<?php endif; ?>
<?php endfor; ?>

<?php // サムネイル一覧 ?>
<?php // 縦長の場合のみサムネイル用画像になる ?>
<div id="thumbnail">
<ul>
  <?php for ($i = 1; $i <= 8; $i++): ?>
  <?php if(get_field('photo' . $i) !== false): ?>
  <?php
    $class_li = $i % 4 === 1 ? ' class="left"' : '';
    $url_image = get_field('thumbnail' . $i);
    $url_image = $url_image === false ? get_field('photo' . $i) : $url_image;
  ?>
  <li<?php echo $class_li; ?>><img src="<?php echo $url_image; ?>" alt="<?php the_field('title'); ?>" /></li>
  <?php endif; ?>
  <?php endfor; ?>
</ul>
</div>
</section>
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
