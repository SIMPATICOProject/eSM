var request= require('request');
var async = require('async');
var express = require('express');
var wf = require('word-freq');
var router = express.Router();

// var old_properties = require('../properties_old');
var properties = require('../properties');
var PARAGRAPHS = require('../paragraphs.json');



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



      if (req.session.demo) {
        try {
          var demoData = require('../demodata.json');

          for (var i=0; i<results.length; i++){
            if (demoData.hasOwnProperty(eservice) && demoData[eservice].hasOwnProperty('pos'+i)) {
              results[i] = demoData[eservice]['pos'+i];
            }
          }
        } catch(e) {
          console.log(e);
        }
      }



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

      if (err) {
        console.error(err);
        next(err);
      } else {

        if (results.length == 2) {
          try {
            var questions = JSON.parse(results[1].value);
            questions.reverse();
            questions.forEach(function(q, index) {
              totalA += q.answers.length;
              totalV += q.stars.length;

              totalText += q.content.length > 0? q.content+" " : "";

              //TODO: Should be regarding a particular paragraph :)
              // For now though, let's assume questions == paragraphs

              var paragraphTag = "Paragraph"+(index+1);
              for(var i = 0; i<q.tags.length; i++){
                if (q.tags[i].text.indexOf('Paragraph') == 0) {
                  paragraphTag = q.tags[i].text;
                  break;
                }
              }

              var paragraph = {
                id: q._id,
                index: paragraphs.length+1,
                text: PARAGRAPHS[eservice][paragraphTag] || "This is a temporary paragraph text. In future versions, the corresponding text will be shown here.",
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


router.get('/simpl/:eservice?', function(req, res, next) {
  var locals = {};
  res.render('simpl', locals, function(err, html) {
    if (err) next(err);
    else res.send(html);
  });
});


router.post('/login', function(req, res, next) {

  console.log("Log in attempt by: " + req.body.username);
  req.session.hasSession = true;

  var loginCreds = properties.getLogin();

  if (loginCreds.username.localeCompare(req.body.username) == 0 && loginCreds.password.localeCompare(req.body.password) == 0) {
    console.log("Log in successful!");
    res.send({success: true});

  } else if (req.body.username.localeCompare("demo") == 0 && req.body.password.localeCompare("demo") == 0) {

    req.session.demo = true;
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


function errorLog (call, expect, result) {

  if (typeof expect === "object") expect = JSON.stringify(expect);

  return Error( "Unexpected response to API call: " + call + ".\n"+
                "Expected response: " + expect + "\n"+
                "Actual response: " + JSON.stringify(result));
};
