$(document).ready(function(){

  var baseURL = $('base').attr('href');


  var href = window.location.href;
  var serviceName = href.substring(href.lastIndexOf('/')+1);
  if ($('#service_select option[value="'+serviceName+'"]').length > 0) {
    $('#service_select').val(serviceName);
  }

  $('#service_select').change(function(){
    window.location.href=baseURL+"stats/"+$(this).val();
  });



console.log(emotions);
if (emotions.show && emotions.value) {
  console.log("Load pie chart");
}

  var ctx = document.getElementById("satisfaction_pie");
  var pieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ["Happy", "Normal", "Sad"],
      datasets: [{
        backgroundColor: ["#399e4c", "#1ebbd9","#de443e"],
        data: [emotions.value[0], emotions.value[1], emotions.value[2]]
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



  var fontSizes = [24, 20, 20, 20, 18, 18, 18, 16, 16, 16, 16, 16, 14, 14, 14, 14, 14];

  var list = [];
  for(var i=0; i<fontSizes.length; i++){
    if (comments.value[i]) {
      list.push([comments.value[i], fontSizes[i]]);
    }
  }

  console.log(list);
  WordCloud(
    document.getElementById('cloud_canvas'),
    {
      list: list
    }
  );


  $('body').keyup(function(){
    console.log(json);
    json[5].results.forEach(function(res){
      console.log(res.data.component);
    });
  });

});


function initMap () {
  var map = new google.maps.Map(document.getElementById('map_canvas'), {
    center: {lat: 42.896802, lng: -7.9156066},
    zoom: 7.5
  });

  console.log(map);

  var kmlMap = new google.maps.KmlLayer({
    url: 'https://simpatico.hi-iberia.es:4570/esm/kml/pruebas.kml'
  });

  kmlMap.setMap(map);


  // Draw in map

  // var drawingManager = new google.maps.drawing.DrawingManager({
  //  drawingMode: google.maps.drawing.OverlayType.MARKER,
  //  drawingControl: true,
  //  drawingControlOptions: {
  //    position: google.maps.ControlPosition.TOP_CENTER,
  //    drawingModes: ['rectangle']
  //  },
  //  markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
  //  rectangleOptions: {
  //    fillColor: '#000000',
  //    fillOpacity: 0.2,
  //    strokeWeight: 2,
  //    clickable: false,
  //    editable: false,
  //    zIndex: 1
  //  }
  // });
  // drawingManager.setMap(map);

  var rectangle;


  google.maps.event.addListener(drawingManager, 'rectanglecomplete', function(event){

    //TODO: Send to back and update... data? :P
    console.log(event.getBounds());


    if (rectangle != null) {
      console.log("Null rectangle");
        rectangle.setMap(null);
    }
    rectangle = event;
    rectangle.setMap(map);
  });
};
