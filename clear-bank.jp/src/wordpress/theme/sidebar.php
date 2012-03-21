<?php
/**
 * サイドバー
 *
 * @package WordPress
 * @subpackage HandiHouse
 */
?>
<div class="hr"></div>
<ul>
<?php
// ウィジェットで設定された動的サイドバー
// カテゴリーとアーカイブを表示前提
if ( !function_exists('dynamic_sidebar') || !dynamic_sidebar()) {
}
?>
</ul>
<div class="hr"></div>
