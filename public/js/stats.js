$(document).ready(function(){

  var baseURL = $('base').attr('href');


  var href = window.location.href;
  var serviceName = href.substring(href.lastIndexOf('/')+1);
  $('#service_select').val(serviceName.length > 0? serviceName : "");

  $('#service_select').change(function(){
    window.location.href=baseURL+"/stats/"+$(this).val();
  });

  var ctx = document.getElementById("satisfaction_pie");
  var pieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ["Happy", "Normal", "Sad"],
      datasets: [{
        backgroundColor: ["#399e4c", "#1ebbd9","#de443e"],
        data: [faces.happy, faces.normal, faces.sad]
      }]
    },
    options: {
      title: {
        display: false,
        text: 'Global'
      },
      legend: {
        display: false,
        position: 'right'
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        }
      }
    }
  });


  //TODO: Analyse text to get most common words and "weigh" them
  // WordCloud(
  //   document.getElementById('cloud_canvas'),
  //   {
  //     list: [
  //       ['entiendo', 20],
  //       ['difícil', 16],
  //       ['palabra', 14],
  //       ['no', 14],
  //       ['balneario', 14],
  //       ['simple', 14],
  //       ['esto', 14],
  //       ['texto', 12]
  //     ]
  //   }
  // );
  WordCloud(
    document.getElementById('cloud_canvas'),
    {
      list: [
        ['word', 20],
        ['cloud', 16],
        ['not', 14],
        ['available', 14]
      ]
    }
  );


});
