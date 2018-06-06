var request= require('request');
var async = require('async');
var express = require('express');
var wf = require('word-freq');
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
        requestLogs(eservice, "total_requests", function(err, result, call){

          if (err) return cb(err);
          if (!result || (result && !result.hasOwnProperty('count'))) {
            return cb(errorLog(call, "<object> {count: <number>, results: <array>}", result));
          }
          cb(err, result);
        });
      },
      function(cb) {
        requestLogs(eservice, "ended_requests", function(err, result, call){
          if (err) return cb(err);
          if (!result || (result && !result.hasOwnProperty('count'))) {
            return cb(errorLog(call, "<object> {count: <number>, results: <array>}", result));
          }
          cb(err, result);
        });
      },
      function(cb) {
        requestLogs(eservice, "faces", function(err, result, call){
          if (err) return cb(err);
          if (!result || (result && !result.hasOwnProperty('count'))) {
            return cb(errorLog(call, "<object> {count: <number>, results: <array>}", result));
          }
          cb(err, result);
        });
      },
      function(cb) {
        requestLogs(eservice, "logins", function(err, result, call){
          if (err) return cb(err);
          if (!result || (result && !result.hasOwnProperty('count'))) {
            return cb(errorLog(call, "<object> {count: <number>, results: <array>}", result));
          }
          cb(err, result);
        });
      },
      function(cb) {
        requestLogs(eservice, "ctzp", function(err, result, call){
          if (err) return cb(err);
          if (!result || (result && !result.hasOwnProperty('count'))) {
            return cb(errorLog(call, "<object> {count: <number>, results: <array>}", result));
          }
          cb(err, result);
        });
      },
      function(cb) {
        requestLogs(eservice, "simpl", function(err, result, call){
          if (err) return cb(err);
          if (!result || (result && !result.hasOwnProperty('count'))) {
            return cb(errorLog(call, "<object> {count: <number>, results: <array>}", result));
          }
          cb(err, result);
        });
      },
      function(cb) {
        requestLogs(eservice, "cdv", function(err, result, call){
          if (err) return cb(err);
          if (!result || (result && !result.hasOwnProperty('count'))) {
            return cb(errorLog(call, "<object> {count: <number>, results: <array>}", result));
          }
          cb(err, result);
        });
      }
    ], function(err, results){
      //TODO: Process result

      // console.log("**************************");
      // results.forEach(function(r){
      //   console.log(r.count);
      // });
      // // console.log(results);
      // console.log("**************************");


      if (err) {
        console.log(err);
        next(err);
        return;
      }




      var faces = {
        total: 0,
        sad: 0,
        normal: 0,
        happy: 0
      };
      if (results[2]) {
        results[2].results.forEach(function(obj){
          if (faces.hasOwnProperty(obj.data["faces-session-feedback"])) {
            faces[obj.data["faces-session-feedback"]]++;
          } else {
            faces[obj.data["faces-session-feedback"]] = 1;
          }
          faces.total++;
        });
      }


      var total_sessions = results[3]? results[3].count : 0;
      var use_ctzp = results[4]? results[4].count : 0;
      var use_simpl = results[5]? results[5].count : 0;
      var use_cdv = results[6]? results[6].count : 0;



      //WORD CLOUD
      var cloud = wf.freq("word word word word cloud cloud cloud not not available", false, false);
      //TODO: Results[7] should be the whole text to word-cloud
      // var cloud = wf.freq(results[7], true, false);

      var topWords = Object.keys(cloud).sort(function(a, b){
        return cloud[b] - cloud[a];
      });



      var locals = {
        total_requests: results[0]? results[0].count : 0,
        ended_requests: results[0]? results[1].count : 0,
        faces: JSON.stringify(faces),
        use_ctzp: Math.floor((use_ctzp/(total_sessions==0? 1 : total_sessions))*100),
        use_simpl: Math.floor((use_simpl/(total_sessions==0? 1 : total_sessions))*100),
        use_cdv: Math.floor((use_cdv/(total_sessions==0? 1 : total_sessions))*100),
        json: JSON.stringify(results[4]),

        //TEMP
        // mean_time: 40,
        // average_age: 35.8,
        // useful_ctzp: 30,
        // useful_simpl: 23,
        // relevant_simpl: 70
        mean_time: "N/A",
        average_age: "N/A",
        useful_ctzp: "N/A",
        useful_simpl: "N/A",
        relevant_simpl: "N/A",
        word_cloud: JSON.stringify(topWords)
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
        requestCTZP(eservice, null, 'questions', function(err, result, call){

          if (err) return cb(err);
          if (isNaN(result)) {
            return cb(errorLog(call, "<number>", result));
          }

          cb(err, Number(result));
        });
      },
      function(cb) {
        requestCTZP(eservice, null, 'answers', function(err, result, call){
          // console.log("Answers request");
          // console.log(result);
          // console.log("-----------------");


          if (!Array.isArray(result)) {
            return cb(errorLog(call, "<array> [{answers: <array>, stars: <array>, tags: <array>}, ...]", result));
          }

          cb(err, result);
        });
      }
    ], function(err, results){
      //TODO: Process results
      var totalA = 0;
      var totalV = 0;
      var paragraphs = [];

      // console.log("ALL RESULTS");
      // console.log(results);
      // console.log("-----------------");

      //TODO: Check result data for correct format

      if (err) {
        console.error(err);
        next(err);
      } else {

        if (results.length > 1 && Array.isArray(results[1])) {
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



        //WORD CLOUD
        var cloud = wf.freq("word word word word cloud cloud cloud not not available", false, false);
        //TODO: Results[7] should be the whole text to word-cloud
        // var cloud = wf.freq(results[7], true, false);

        var topWords = Object.keys(cloud).sort(function(a, b){
          return cloud[b] - cloud[a];
        });


        var locals = {
          total_questions: results.length > 1? results[0] : 0,
          total_answers: totalA,
          total_votes: totalV,
          paragraphs: paragraphs,
          json: results.length > 1? JSON.stringify(results[1]) : [],
          word_cloud: JSON.stringify(topWords)
        };

        // console.log(locals);

        res.render('qandas', locals, function(err, html){
          if(err) next(err);
          else res.send(html);
        });
      }


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

  console.log("Log in attempt by: " + req.body.username);
  req.session.hasSession = true;

  var loginCreds = properties.getLoginUser();

  if (loginCreds.username.localeCompare(req.body.username) == 0 && loginCreds.password.localeCompare(req.body.password) == 0) {
    console.log("Log in successful!");
    res.send({success: true});
  } else {
    console.log("Log in failed!")
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

  console.log("Request to: " + properties.getCTZP_URL()+apicall);

  request(properties.getCTZP_URL()+apicall, function(error, response, body) {

    if(error) {
      console.error("Error on: " + properties.getCTZP_URL()+apicall);
      console.error(error);
      return callback(error);
    } else {
      if(typeof body === "string"){
        try {
          var objBody = JSON.parse(body);
          return callback(null, objBody, properties.getCTZP_URL()+apicall);
        }catch(e){
          return callback(null, body, properties.getCTZP_URL()+apicall);
        }
      }else{
        return callback(null, body, properties.getCTZP_URL()+apicall);
      }
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

  console.log("Request to: " + properties.getLogs_URL()+apicall);

  request(properties.getLogs_URL()+apicall, function(error, response, body) {
    if (error) {
      console.log("Error on: " + properties.getLogs_URL()+apicall);
      console.log(error);
      return callback(error);
    }

    var objBody = null;
    if(typeof body === "string"){
      try {
        objBody = JSON.parse(body);
      }catch(e){
        console.log(e);
      }finally{
        return callback(null, objBody || body, properties.getLogs_URL()+apicall);
      }
    }else{
      return callback(null, body, properties.getLogs_URL()+apicall);
    }
  });
};




function errorLog (call, expect, result) {

  if (typeof expect === "object") expect = JSON.stringify(expect);

  return Error( "Unexpected response to API call: " + call + ".\n"+
                "Expected response: " + expect + "\n"+
                "Actual response: " + JSON.stringify(result));
};
