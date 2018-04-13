var request= require('request');
var async = require('async');
var express = require('express');
var router = express.Router();

URL_CTZP = "https://simpatico.morelab.deusto.es/qae/api";
// URL_CTZP = "https://simpatico.hi-iberia.es:4569/qae/api";
// URL_IFE = "https://simpatico.hi-iberia.es:4570/simpatico/api";
URL_IFE = "http://localhost:8090/simpatico/api";


router.get('/stats/:eservice?', function(req, res, next) {

  var eservice = req.params.eservice;
  if(eservice){
    async.parallel([
      function(cb) {
        requestIFE(eservice, "total_requests", function(err, result){
          cb(err, result);
        });
      },
      function(cb) {
        requestIFE(eservice, "ended_requests", function(err, result){
          cb(err, result);
        });
      },
      function(cb) {
        requestIFE(eservice, "faces", function(err, result){
          cb(err, result);
        });
      },
      function(cb) {
        requestIFE(eservice, "logins", function(err, result){
          cb(err, result);
        });
      },
      function(cb) {
        requestIFE(eservice, "ctzp", function(err, result){
          cb(err, result);
        });
      },
      function(cb) {
        requestIFE(eservice, "simpl", function(err, result){
          cb(err, result);
        });
      },
      function(cb) {
        requestIFE(eservice, "cdv", function(err, result){
          cb(err, result);
        });
      }
    ], function(err, results){
      //TODO: Process result

      var faces = {
        total: 0,
        sad: 0,
        normal: 0,
        happy: 0
      };
      results[2].results.forEach(function(obj){
        faces[obj.data["faces-session-feedback"]]++;
        faces.total++;
      });


      var total_sessions = results[3].count;
      var use_ctzp = results[4].count;
      var use_simpl = results[5].count;
      var use_cdv = results[6].count;


      var locals = {
        total_requests: results[0].count,
        ended_requests: results[1].count,
        faces: JSON.stringify(faces),
        use_ctzp: Math.floor((use_ctzp/total_sessions)*100),
        use_simpl: Math.floor((use_simpl/total_sessions)*100),
        use_cdv: Math.floor((use_cdv/total_sessions)*100),
        json: JSON.stringify(results[4]),

        //TEMP
        mean_time: 40,
        average_age: 35.8,
        useful_ctzp: 30,
        useful_simpl: 23,
        relevant_simpl: 70
      };

      res.render('stats', locals, function(err, html){
        if(err) next(err);
        else res.send(html);
      });
    });
  }else{
    res.render('stats', function(err, html){
      if(err) next(err);
      else res.send(html);
    });
  }
});


router.get('/qandas/:eservice?', function(req, res, next) {

  var eservice = req.params.eservice;
  if(eservice){
    async.parallel([
      function(cb) {
        requestCTZP(eservice, null, 'questions', function(err, result){
          cb(err, result);
        });
      },
      function(cb) {
        requestCTZP(eservice, null, 'answers', function(err, result){
          cb(err, result);
        });
      }
    ], function(err, results){
      //TODO: Process results
      var totalA = 0;
      var totalV = 0;
      var paragraphs = [];

      results[1].forEach(function(obj){
        totalA += obj.answers.length;
        totalV += obj.stars.length;

        //TODO: Should be regarding a particular paragraph :)
        // For now though, let's assume questions == paragraphs

        var paragraph = {
          index: paragraphs.length+1,
          text: "This is supposed to be a paragraph, but this part is still pending, I hope we eventually get the code to be able to obtain this text properly.",
          questions: 1,
          answers: obj.answers.length,
          votes: obj.stars.length,
          tags: obj.tags
        };
        paragraphs.push(paragraph);

      });


      var locals = {
        total_questions: results[0],
        total_answers: totalA,
        total_votes: totalV,
        paragraphs: paragraphs,
        json: JSON.stringify(results[1])
      };

      console.log(locals);

      res.render('qandas', locals, function(err, html){
        if(err) next(err);
        else res.send(html);
      });
    });
  }else{
    res.render('qandas', function(err, html){
      if(err) next(err);
      else res.send(html);
    });
  }
});

router.get('/:page/:eservice?', function(req, res, next) {
  res.render(req.params.page, function(err, html){
    if(err) next(err);
    else res.send(html);
  });
});


router.post('/login', function(req, res, next) {
  console.log("Logging in!");
  req.session.hasSession = true;
  res.redirect('/stats');
});

module.exports = router;



function requestCTZP (eservice, paragraph, type, callback){
  var apicall = "";
  if(type == "questions") apicall = "/stats/questions/"+eservice+(paragraph? "/"+paragraph : "");
  if(type == "answers" || type == "votes") apicall = "/qae/questions/"+eservice+(paragraph? "/"+paragraph : "");

  console.log(URL_CTZP+apicall);

  request(URL_CTZP+apicall, function(error, response, body) {
    if(error) return callback(error);

    if(typeof body === "string"){
      try {
        var objBody = JSON.parse(body);
        return callback(null, objBody);
      }catch(e){
        return callback(null, body);
      }
    }else{
      return callback(null, body);
    }
  });
};


function requestIFE (eservice, type, callback){
  var apicall = "";
  if(type == "total_requests") apicall = "/ife/find?common="+eservice+"&search=form_start";
  if(type == "ended_requests") apicall = "/ife/find?common="+eservice+"&search=form_end";
  if(type == "faces") apicall = "/logs/find?common="+eservice+"&search=sad,normal,happy";
  if(type == "logins") apicall = "/ife/find?common="+eservice+"&search=session_start";
  if(type == "ctzp") apicall = "/logs/find?common="+eservice+"&search=citizenpedia_start";
  if(type == "simpl") apicall = "/logs/find?common="+eservice+"&search=simplification_start";
  if(type == "cdv") apicall = "/logs/find?common="+eservice+"&search=usedata";

  console.log(URL_IFE+apicall);

  request(URL_IFE+apicall, function(error, response, body) {
    if(error) return callback(error);

    console.log("Success!! "+URL_IFE+apicall);
    console.log(typeof body);

    var objBody = null;
    if(typeof body === "string"){
      try {
        objBody = JSON.parse(body);
      }catch(e){
        //Do nothing
        console.log(e);
      }finally{
        return callback(null, objBody || body);
      }
    }else{
      return callback(null, body);
    }
  });
};
