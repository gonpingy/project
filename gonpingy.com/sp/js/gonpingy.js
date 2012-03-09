$(function(){
  $("#closeMenu").hide();
  $("#openMenu").click(function () {
    $("#menu, #menu ul").addClass("active");
    $("#closeMenu").show();
  });
  $("#closeMenu").click(function () {
    $("#menu, #menu ul").removeClass("active");
    $("#closeMenu").hide();
  });

  today = new Date();
  $('#closeMenu').html(today.getTime());
  changeBackground(today);

  $('li.date').bind('click', function() {
    date = new Date();
    date.setTime($('#closeMenu').text());

    switch(this.id) {
      case 'yesterday':
        date.setTime(date.getTime() - 86400000);
        break;
      case 'today':
        break;
      case 'tomorrow':
        date.setTime(date.getTime() + 86400000);
        break;
    }

    $('#closeMenu').html(date.getTime());
    changeBackground(date);
  });
});

var changeBackground = function(date) {
  minTakenDate = date.getFullYear() + '-' + String(date.getMonth() + 1).replace(/^([1-9]{1})$/, '0$1') + '-' + String(date.getDate()).replace(/^([1-9]{1})$/, '0$1');
  date.setTime(date.getTime() + 86400000);

  $.ajax({
    'data': {
      'api_key': '83fbd100f73d89e031214e37686e10bf',
      'format': 'json',
      'max_taken_date': date.getFullYear() + '-' + String(date.getMonth() + 1).replace(/^([1-9]{1})$/, '0$1') + '-' + String(date.getDate()).replace(/^([1-9]{1})$/, '0$1'),
      'method': 'flickr.photos.search',
      'min_taken_date': minTakenDate,
      'per_page': 1,
      'tags': '食卓',
      'user_id': '25327833@N03'
    },
    'dataType': 'jsonp',
    'jsonp': 'jsoncallback',
    'type': 'GET',
    'url': 'http://www.flickr.com/services/rest/'
  })
  .success(function(data) {
    if (data.photos.total != '0') {
      var photo = data.photos.photo[0];
      $('html').css('background-image', 'url(http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '.jpg');
    }
  });
};
