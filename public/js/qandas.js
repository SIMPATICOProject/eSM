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


  //TODO: Analyse text to get most common words and "weigh" them
  WordCloud(
    document.getElementById('cloud_canvas'),
    {
      list: [
        ['entiendo', 20],
        ['difícil', 16],
        ['palabra', 14],
        ['no', 14],
        ['balneario', 14],
        ['simple', 14],
        ['esto', 14],
        ['texto', 12]
      ]
    }
  );


});
