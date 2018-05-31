$(document).ready(function(){

  var baseURL = $('base').attr('href');

  $('form').submit(function(e){
    e.preventDefault();

    $('#error').hide();

    $.post('login',
      {
        username: $('[name="username"]').val(),
        password: $('[name="password"]').val()
      }
    )
    .then(function(data){
      console.log(data);
      if (data.error) {
        $('#error').show();
      } else {
        window.location.href=baseURL+"stats/";
      }
    });
  });
});
