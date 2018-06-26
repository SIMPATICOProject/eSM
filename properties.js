var fs = require('fs');
var path = require('path');
var extend = require('extend');

var properties = {};
try {
  properties = require('./properties.json');
} catch(e){
  console.log("WARNING: Cannot find properties.json");
}


function getENV (key) {
  var envkey = key.replace(/_/g, "").toUpperCase();
  if (process.env.hasOwnProperty(envkey)) {
    console.log("Using ENV variable: " + envkey);
  }
  return process.env[envkey];
};

function getProperties (key, parent) {
  var props = Object.assign({}, properties);
  if (props) {
    if (parent && props.hasOwnProperty(parent)) {
      props = props[parent];
    }
    if (props[key]) {
      console.log("Using property: " + key);
    }
    return props[key];
  } else {
    return null;
  }
};

module.exports = {
  getURL: function (key, eservice, options) {

    //TODO: Use options to add init & end?

    var url = getENV(key) || getProperties(key, 'urls');
    if (typeof url === 'string') {
      return url.replace(/::eservice/g, eservice);
    } else if (typeof url === 'boolean') {
      return url;
    } else {
      return null;
    }
  },
  getLogin: function (key) {
    var env = null;
    var envUser = process.env.USERNAME;
    var envPass = process.env.PASSWORD;
    if (envUser && envPass) {
      env = {
        username: envUser,
        password: envPass
      }
    }

    return env || getProperties('login') || {username:"",password:""};
  },
  getEservices: function () {
    var envES = process.env.ESERVICES;
    var env = null;
    if (envES) {
      var eArray = envES.split(' ; ');
      if (eArray.length > 0 && eArray[0].indexOf(' : ') > 0) {
        env = [];
        eArray.forEach(function(e){
          var eObj = e.split(' : ');
          var obj = {};
          obj.code = eObj[0];
          obj.name = eObj[1];
          env.push(obj);
        });
      }
    }
    return env || getProperties('eservices') || [];
  }
};




















//
//
//
// var default_base = "/";
// var default_CTZP = "https://simpatico.hi-iberia.es:4569/qae/api";
// var default_logs = "https://simpatico.hi-iberia.es:4570/simpatico/api";
// var default_login = {
//   username: "",
//   password: ""
// };
//
// function getProperties (prop) {
//   try {
//     var properties = JSON.parse(fs.readFileSync(path.join(__dirname, 'properties.json'), 'utf-8'));
//     return properties[prop] || null;
//   } catch(e) {
//     console.log(e);
//     return null;
//   }
// };
//
//
// module.exports = {
//   getBase_URL : function(){
//     return process.env.BASEURL || getProperties('base_url') || default_base;
//   },
//   getCTZP_URL : function(){
//     return process.env.CTZPURL || getProperties('citizenpedia_url') || default_CTZP;
//   },
//   getLogs_URL : function(){
//     return process.env.LOGSURL || getProperties('logs_url') || default_logs;
//   },
//   getEservices : function(){
//     var envES = process.env.ESERVICES;
//     var env = null;
//     if (envES) {
//       var eArray = envES.split(' ; ');
//       if (eArray.length > 0 && eArray[0].indexOf(' : ') > 0) {
//         env = [];
//         eArray.forEach(function(e){
//           var eObj = e.split(' : ');
//           var obj = {};
//           obj.code = eObj[0];
//           obj.name = eObj[1];
//           env.push(obj);
//         });
//       }
//     }
//
//     return env || getProperties('eservices') || [];
//   },
//   getLoginUser : function(){
//
//     var env = null;
//     var envUser = process.env.USERNAME;
//     var envPass = process.env.PASSWORD;
//     if (envUser && envPass) {
//       env = {
//         username: envUser,
//         password: envPass
//       }
//     }
//
//     return env || getProperties('login') || default_login;
//   }
// }
