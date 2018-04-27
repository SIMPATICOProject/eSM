$(document).ready(function(){

  var baseURL = $('base').attr('href');

  console.log(window.location.pathname);
  var pathparts = window.location.pathname.split("/");
  pathparts.forEach(function(part) {
    $('.header_tab a[href="'+part+'"]').parent().addClass('active');
  });

  $('.header_tab a').click(function(e){
    e.preventDefault();
    var pathpart = window.location.pathname.split("/");

    var service = $('#service_select').val();

    window.location.href = baseURL+$(this).attr('href') + (service? "/"+service: "");
  });

  $('#simpatico_user span').click(function(){
    $.post(baseURL+'logout', {}, function(data){
      if (data.hasOwnProperty('logout') && data.logout.localeCompare('success') == 0){
        window.location.href = baseURL+"/";
      }
    });
  });

});
