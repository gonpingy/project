  <?php // topページ以外の場合 ?>
  <?php if (get_page_link() != get_bloginfo('home') . CLEAR_BANK_PATH_TOP): ?>
  <footer>
    <!--
    <ul>
      <li><a href="">お問い合わせ</a></li>
      <li><a href="">資料請求</a></li>
      <li><a href="">採用情報</a></li>
    </ul>
    -->
    <div>Copyright© CLEAR BANK CO., LTD. All Rights Reserved.</div>
  </footer>
  <script src="<?php echo get_bloginfo('template_url') . CLEAR_BANK_PATH_JS; ?>/jquery-1.7.1.min.js"></script>
  <script>
    $(function() {
      var top = $('#top');
      if(top) {
        top.fadeOut(2000, function() {
          $('header, footer, #brochure, #content').fadeIn(1000);
        });
      }
    });
  </script>
  <?php endif; ?>
</body>
</html>
