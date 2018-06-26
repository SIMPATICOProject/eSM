var request= require('request');
var async = require('async');
var express = require('express');
var wf = require('word-freq');
var router = express.Router();

// var old_properties = require('../properties_old');
var properties = require('../properties');


var NOTAVAILABLE = "N/A";



router.get('/', function(req, res, next) {
  //TODO: Default landing tab
  res.redirect(properties.getURL('base')+'stats/');
});


function makeRequest (key, eservice, expected, callback) {

  var url = properties.getURL(key, eservice);


  var result = {
    show: true
  };

  if (typeof url === "string" && url.length > 0) {
    request(url, function(error, response, body) {
      if (error) {
        console.error("Error on: " + url);
        console.log(error);
        result.error = error;
      } else {
        console.log("["+key+"]: "+url);
        console.log("["+key+"]: "+body);
        //Possible values: Number or Array
        if (!isNaN(body)) {
          if (expected == "number") {
            result.value = ""+body;
          } else {
            result.error = "ERROR: ["+key+"] " + expected + " expected. Received: " + body;
          }
        } else if (body.indexOf('[') == 0 && body.indexOf(']') == body.length-1) {

          if (expected == "array") {
            try {
              result.value = JSON.parse(body);
            } catch(e) {
              console.log(e);
              result.error = e;
            }
          } else {
            result.error = "ERROR: ["+key+"] " + expected + " expected. Received: " + body;
          }
        } else {
          if (expected == "string") {
            result.value = body;
          } else {
            result.error = "ERROR: ["+key+"] " + expected + " expected. Received: " + body;
          }
        }

        // console.log(body);
        // try {
        //   body = JSON.parse(body);
        // } catch (e) {}
        // if (typeof body === "object") {
        //   result.value = body.count;
        // } else {
        //   result.value = ""+body;
        // }
      }
      callback(result);
    });

  } else if (typeof url === "string" || typeof url === true ) {
    result.string = NOTAVAILABLE;
    callback(result);
  } else {
    result.show = false;
    console.log("["+key+"] Not found or set to false.");
    callback(result);
  }
};



router.get('/stats/:eservice?', function(req, res, next) {

  var eservice = req.params.eservice;
  if (eservice) {
    async.parallel([

      // Total Requests
      function (cb) {
        makeRequest ("total_requests", eservice, "number", function(result){ cb(null, result); });
      },
      // Finished Requests
      function (cb) {
        makeRequest ("finished_requests", eservice, "number", function(result){ cb(null, result); });
      },
      // Average Time
      function (cb) {
        makeRequest ("average_time", eservice, "number", function(result){ cb(null, result); });
      },
      // Average Age
      function (cb) {
        makeRequest ("average_age", eservice, "number", function(result){ cb(null, result); });
      },
      // Emotions
      function (cb) {
        makeRequest ("emotions", eservice, "array", function(result){ cb(null, result); });
      },
      // Satisfaction comments
      function (cb) {
        makeRequest ("sat_comment", eservice, "string", function(result){

          //TODO: Cleanup words in Spanish (ie. remove accents and commonly used words)
          if (result.value && result.value.length > 0) {
            var cloud = wf.freq(result.value, false, false);

            var topWords = Object.keys(cloud).sort(function(a, b){
              return cloud[b] - cloud[a];
            });
            result.value = topWords;
          } else {
            result.value = [];
          }
          cb(null, result);
        });
      },
      // Citizenpedia Use
      function (cb) {
        makeRequest ("ctzp_use", eservice, "number", function(result){ cb(null, result); });
      },
      // Citizenpedia Useful
      function (cb) {
        makeRequest ("ctzp_useful", eservice, "number", function(result){ cb(null, result); });
      },
      // Citizenpedia Relevant
      function (cb) {
        makeRequest ("ctzp_relevant", eservice, "number", function(result){ cb(null, result); });
      },
      // TAE Use
      function (cb) {
        makeRequest ("tae_use", eservice, "number", function(result){ cb(null, result); });
      },
      // TAE Useful
      function (cb) {
        makeRequest ("tae_useful", eservice, "number", function(result){ cb(null, result); });
      },
      // TAE Relevant
      function (cb) {
        makeRequest ("tae_relevant", eservice, "number", function(result){ cb(null, result); });
      },
      // CDV Use
      function (cb) {
        makeRequest ("cdv_use", eservice, "number", function(result){ cb(null, result); });
      },
      // CDV Useful
      function (cb) {
        makeRequest ("cdv_useful", eservice, "number", function(result){ cb(null, result); });
      },
      // CDV Relevant
      function (cb) {
        makeRequest ("cdv_relevant", eservice, "number", function(result){ cb(null, result); });
      },
      // WAE Use
      function (cb) {
        makeRequest ("wae_use", eservice, "number", function(result){ cb(null, result); });
      },
      // WAE Useful
      function (cb) {
        makeRequest ("wae_useful", eservice, "number", function(result){ cb(null, result); });
      },
      // WAE Relevant
      function (cb) {
        makeRequest ("wae_relevant", eservice, "number", function(result){ cb(null, result); });
      }
    ], function(err, results){
      var locals = {
        eservice: eservice,

        total_requests: results[0],
        finished_requests: results[1],
        average_time: results[2],
        average_age: results[3],

        emotions_str: JSON.stringify(results[4]),
        emotions: results[4],
        comments_str: JSON.stringify(results[5]),
        comments: results[5],

        ctzp_use: results[6],
        ctzp_useful: results[7],
        ctzp_relevant: results[8],
        tae_use: results[9],
        tae_useful: results[10],
        tae_relevant: results[11],
        cdv_use: results[12],
        cdv_useful: results[13],
        cdv_relevant: results[14],
        wae_use: results[15],
        wae_useful: results[16],
        wae_relevant: results[17],

        json: JSON.stringify(results)
      };

      res.render('stats', locals, function(err, html){
        if(err) next(err);
        else res.send(html);
      });
    });
  } else {
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

      // Number of questions total
      function (cb) {
        makeRequest ("questions_stats", eservice, "number", function(result){ cb(null, result); });
      },
      // Questions
      function (cb) {
        makeRequest ("questions_qae", eservice, "string", function(result){ cb(null, result); });
      }
    ], function(err, results){
      //TODO: Process results
      var totalA = 0;
      var totalV = 0;
      var totalText = "";
      var paragraphs = [];

      // console.log("ALL RESULTS");
      // console.log(results);
      // console.log("-----------------");

      //TODO: Check result data for correct format

      if (err) {
        console.error(err);
        next(err);
      } else {

        console.log(results);


        if (results.length == 2) {
          try {
            var questions = JSON.parse(results[1].value);
            questions.forEach(function(q) {
              totalA += q.answers.length;
              totalV += q.stars.length;

              totalText += q.content.length > 0? q.content+" " : "";

              //TODO: Should be regarding a particular paragraph :)
              // For now though, let's assume questions == paragraphs

              var paragraph = {
                index: paragraphs.length+1,
                text: "This is a temporary paragraph text. In future versions, the corresponding text will be shown here.",
                questions: 1,
                answers: q.answers.length,
                votes: q.stars.length,
                tags: q.tags
              };
              paragraphs.push(paragraph);
            });
          } catch(e) {
            console.log(e);
          }
        }



        // if (results.length > 1 && Array.isArray(results[1])) {
        //   results[1].forEach(function(obj){
        //     totalA += obj.answers.length;
        //     totalV += obj.stars.length;
        //
        //     //TODO: Should be regarding a particular paragraph :)
        //     // For now though, let's assume questions == paragraphs
        //
        //     var paragraph = {
        //       index: paragraphs.length+1,
        //       text: "This is a temporary paragraph text. In future versions, the corresponding text will be shown here.",
        //       questions: 1,
        //       answers: obj.answers.length,
        //       votes: obj.stars.length,
        //       tags: obj.tags
        //     };
        //     paragraphs.push(paragraph);
        //
        //   });
        // }



        //WORD CLOUD
        if (totalText.length > 0) {

          var cloud = wf.freq(totalText, false, false);
          //TODO: Clean text from typical Spanish words

          var topWords = Object.keys(cloud).sort(function(a, b){
            return cloud[b] - cloud[a];
          });


        }

        var locals = {
          total_questions: results[0],
          total_answers: totalA,
          total_votes: totalV,
          paragraphs: paragraphs,
          json: JSON.stringify(results),

          eservice: eservice,

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


router.post('/login', function(req, res, next) {

  console.log("Log in attempt by: " + req.body.username);
  req.session.hasSession = true;

  var loginCreds = properties.getLogin();

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



// function requestCTZP (eservice, paragraph, type, callback){
//   var apicall = "";
//   if(type == "questions") apicall = "/stats/questions/"+eservice+(paragraph? "/"+paragraph : "");
//   if(type == "answers" || type == "votes") apicall = "/qae/questions/"+eservice+(paragraph? "/"+paragraph : "");
//
//   console.log("Request to: " + old_properties.getCTZP_URL()+apicall);
//
//   request(old_properties.getCTZP_URL()+apicall, function(error, response, body) {
//
//     if(error) {
//       console.error("Error on: " + old_properties.getCTZP_URL()+apicall);
//       console.error(error);
//       return callback(error);
//     } else {
//       if(typeof body === "string"){
//         try {
//           var objBody = JSON.parse(body);
//           return callback(null, objBody, old_properties.getCTZP_URL()+apicall);
//         }catch(e){
//           return callback(null, body, old_properties.getCTZP_URL()+apicall);
//         }
//       }else{
//         return callback(null, body, old_properties.getCTZP_URL()+apicall);
//       }
//     }
//
//   });
// };


// function requestLogs (eservice, type, callback){
//   var apicall = "";
//   if(type == "total_requests") apicall = "/ife/find?common="+eservice+"&search=form_start";
//   if(type == "ended_requests") apicall = "/ife/find?common="+eservice+"&search=form_end";
//   if(type == "faces") apicall = "/logs/find?common="+eservice+"&search=sad,normal,happy";
//   if(type == "logins") apicall = "/ife/find?common="+eservice+"&search=session_start";
//   if(type == "ctzp") apicall = "/logs/find?common="+eservice+"&search=citizenpedia_start";
//   if(type == "simpl") apicall = "/logs/find?common="+eservice+"&search=simplification_start";
//   if(type == "cdv") apicall = "/logs/find?common="+eservice+"&search=usedata";
//
//   console.log("Request to: " + old_properties.getLogs_URL()+apicall);
//
//   request(old_properties.getLogs_URL()+apicall, function(error, response, body) {
//     if (error) {
//       console.log("Error on: " + old_properties.getLogs_URL()+apicall);
//       console.log(error);
//       return callback(error);
//     }
//
//     var objBody = null;
//     if(typeof body === "string"){
//       try {
//         objBody = JSON.parse(body);
//       }catch(e){
//         console.log(e);
//       }finally{
//         return callback(null, objBody || body, old_properties.getLogs_URL()+apicall);
//       }
//     }else{
//       return callback(null, body, old_properties.getLogs_URL()+apicall);
//     }
//   });
// };




function errorLog (call, expect, result) {

  if (typeof expect === "object") expect = JSON.stringify(expect);

  return Error( "Unexpected response to API call: " + call + ".\n"+
                "Expected response: " + expect + "\n"+
                "Actual response: " + JSON.stringify(result));
};
