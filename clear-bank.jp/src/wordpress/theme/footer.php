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
  <?php // topページ以外の場合 ?>
  <?php if (get_page_link() != get_bloginfo('home') . CLEAR_BANK_PATH_TOP): ?>
  <?php // topページの場合 ?>
  <?php else: ?>
  <script>
    $(function() {
      var menu = $('ul#menu').find('li');
      menu.bind('mouseover', showSubMenu);
    });

    showSubMenu('about');

    function showSubMenu(id) {
      id = typeof(id) == 'string' ? id : this.id;
      $('#subMenu').find('ul').hide();
      var subMenu = $('#sub' + id).find('li');
      
      if (subMenu.length > 3) {
        var leftDefault = 20;
        var leftInterval = 60;
        var topDefault = 20;
        var topInterval = 10;
      } else {
        var leftDefault = 20;
        var leftInterval = 120;
        var topDefault = 50;
        var topInterval = 30;
      }
      
      for (var i = 0; i < subMenu.length; i++) {
        subMenu.eq(i).css({'left': (leftDefault + i * leftInterval) + 'px', 'top': (topDefault + i * topInterval) + 'px'});
      }
      
      subMenu.show().parent().show();
    }
  </script>
  <?php endif; ?>
</body>
</html>
