<?php
/*
 * Template Name: comment
 */
?>
<?php // コメントがある場合 ?>
<?php foreach (get_comments(array('post_id' => get_the_ID(), 'status' => 'approve')) as $comment): ?>
<div class="hr"></div>
<section>
<div><?php comment_text(); ?></div>
<div class="comment_info">
<ul>
<li><?php comment_date('Y.m.d'); ?></li>
<li><?php comment_author(); ?></li>
</ul>
</div>
</section>
<?php endforeach; ?>
<div id="comment_form">
<?php 
  $fields = array(
    'author' => '<p><label for="author">' . __( 'Name' ) . '※ </label>' .
                '<p><input id="author" name="author" type="text" value="" size="30" /></p>',
    'email' => '<p><label for="email">' . __( 'Email' ) . '※ </label>' .
               '<p><input id="email" name="email" type="text" value="" size="30" /></p>',
    'url' => '<p><label for="url">' . __( 'Website' ) . '</label>' .
             '<p><input id="url" name="url" type="text" value="" size="30" /></p>'
  );
  comment_form(array(
    'fields' => apply_filters( 'comment_form_default_fields', $fields),
    'comment_field' => '<p><label for="comment">' . _x( 'Comment', 'noun' ) . '</label></p><p><textarea id="comment" name="comment" cols="45" rows="8" aria-required="true"></textarea></p>',
    'comment_notes_after' => '',
    'comment_notes_before' => '※がついている欄は必須項目です。メールアドレスが公開されることはありません。',
    'title_reply' => __('コメントをどうぞ')
  ));
?>
</div>
