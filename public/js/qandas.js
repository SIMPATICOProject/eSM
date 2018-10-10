$(document).ready(function(){

  var baseURL = $('base').attr('href');

  var href = window.location.href;
  var serviceName = href.substring(href.lastIndexOf('/')+1);
  if ($('#service_select option[value="'+serviceName+'"]').length > 0) {
    $('#service_select').val(serviceName);
  }

  $('#service_select').change(function(){
    window.location.href=baseURL+"qandas/"+$(this).val();
  });

  $('.tag').click(function() {
    window.location.href = $(this).data('href');
  });


  var list = [];
  var fontSizes = [24, 20, 20, 20, 18, 18, 18, 16, 16, 16, 16, 16, 14, 14, 14, 14, 14];
  for(var i=0; i<fontSizes.length; i++){
    if (cloud[i]) {
      list.push([cloud[i], fontSizes[i]]);
    }
  }

  WordCloud(
    document.getElementById('cloud_canvas'),
    {
      list: list
    }
  );


});
