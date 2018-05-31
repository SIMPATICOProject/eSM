var request= require('request');
var async = require('async');
var express = require('express');
var router = express.Router();

var properties = require('../properties');

router.get('/', function(req, res, next) {
  //TODO: Default landing tab
  res.redirect(properties.getBase_URL()+'stats/');
});

router.get('/stats/:eservice?', function(req, res, next) {

  var eservice = req.params.eservice;
  if(eservice){
    async.parallel([
      function(cb) {
        requestLogs(eservice, "total_requests", function(err, result){
          cb(err, result);
        });
      },
      function(cb) {
        requestLogs(eservice, "ended_requests", function(err, result){
          cb(err, result);
        });
      },
      function(cb) {
        requestLogs(eservice, "faces", function(err, result){
          cb(err, result);
        });
      },
      function(cb) {
        requestLogs(eservice, "logins", function(err, result){
          cb(err, result);
        });
      },
      function(cb) {
        requestLogs(eservice, "ctzp", function(err, result){
          cb(err, result);
        });
      },
      function(cb) {
        requestLogs(eservice, "simpl", function(err, result){
          cb(err, result);
        });
      },
      function(cb) {
        requestLogs(eservice, "cdv", function(err, result){
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
          console.log(result);
          cb(err, result);
        });
      },
      function(cb) {
        requestCTZP(eservice, null, 'answers', function(err, result){
          console.log(result);
          cb(err, result);
        });
      }
    ], function(err, results){
      //TODO: Process results
      var totalA = 0;
      var totalV = 0;
      var paragraphs = [];

      console.log(results);

      if (results.length > 1) {
        results[1].forEach(function(obj){
          totalA += obj.answers.length;
          totalV += obj.stars.length;

          //TODO: Should be regarding a particular paragraph :)
          // For now though, let's assume questions == paragraphs

          var paragraph = {
            index: paragraphs.length+1,
            text: "This is a temporary paragraph text. In future versions, the corresponding text will be shown here.",
            questions: 1,
            answers: obj.answers.length,
            votes: obj.stars.length,
            tags: obj.tags
          };
          paragraphs.push(paragraph);

        });
      }



      var locals = {
        total_questions: results.length > 1? results[0] : 0,
        total_answers: totalA,
        total_votes: totalV,
        paragraphs: paragraphs,
        json: results.length > 1? JSON.stringify(results[1]) : []
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

  var loginCreds = properties.getLoginUser();

  if (loginCreds.username.localeCompare(req.body.username) == 0 && loginCreds.password.localeCompare(req.body.password) == 0) {

    console.log("Success!!");
    res.send({success: true});
    // res.redirect(properties.getBase_URL()+'stats');
  } else {
    res.send({error: true});
  }
});

router.post('/logout', function(req, res, next) {
  req.session.destroy();
  res.send({logout: 'success'});
});

module.exports = router;



function requestCTZP (eservice, paragraph, type, callback){
  var apicall = "";
  if(type == "questions") apicall = "/stats/questions/"+eservice+(paragraph? "/"+paragraph : "");
  if(type == "answers" || type == "votes") apicall = "/qae/questions/"+eservice+(paragraph? "/"+paragraph : "");

  console.log(properties.getCTZP_URL()+apicall);

  request(properties.getCTZP_URL()+apicall, function(error, response, body) {
    console.log(error);
    if(error) return callback(error);

    console.log("+++++++++++++++++++++++");
    console.log(response);
    console.log(body);
    console.log("-----------------------");

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


function requestLogs (eservice, type, callback){
  var apicall = "";
  if(type == "total_requests") apicall = "/ife/find?common="+eservice+"&search=form_start";
  if(type == "ended_requests") apicall = "/ife/find?common="+eservice+"&search=form_end";
  if(type == "faces") apicall = "/logs/find?common="+eservice+"&search=sad,normal,happy";
  if(type == "logins") apicall = "/ife/find?common="+eservice+"&search=session_start";
  if(type == "ctzp") apicall = "/logs/find?common="+eservice+"&search=citizenpedia_start";
  if(type == "simpl") apicall = "/logs/find?common="+eservice+"&search=simplification_start";
  if(type == "cdv") apicall = "/logs/find?common="+eservice+"&search=usedata";

  console.log(properties.getLogs_URL()+apicall);

  request(properties.getLogs_URL()+apicall, function(error, response, body) {
    if(error) return callback(error);

    console.log("Success!! "+properties.getLogs_URL()+apicall);

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
