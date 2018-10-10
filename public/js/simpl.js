$(document).ready(function(){

  var baseURL = $('base').attr('href');

  var href = window.location.href;
  var serviceName = href.substring(href.lastIndexOf('/')+1);
  if ($('#service_select option[value="'+serviceName+'"]').length > 0) {
    $('#service_select').val(serviceName);
  }

});
