$(document).ready(function(){

  console.log(window.location.pathname);
  var pathparts = window.location.pathname.split("/");
  $('a[href="/'+pathparts[1]+'"]').parent().addClass('active');

  $('.header_tab a').click(function(e){
    e.preventDefault();
    var pathpart = window.location.pathname.split("/");
    window.location.href = $(this).attr('href') + (pathpart.length > 2? "/"+pathpart[2] : "");
  });

});
