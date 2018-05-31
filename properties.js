var fs = require('fs');

var default_base = "/";
var default_CTZP = "https://simpatico.hi-iberia.es:4569/qae/api";
var default_logs = "https://simpatico.hi-iberia.es:4570/simpatico/api";
var default_login = {
  username: "",
  password: ""
};

function getProperties (prop) {
  try {
    var properties = JSON.parse(fs.readFileSync('./properties.json', 'utf-8'));
    return properties[prop] || null;
  } catch(e) {
    console.log(e);
    return null;
  }
};


module.exports = {
  getBase_URL : function(){
    return process.env.BASEURL || getProperties('base_url') || default_base;
  },
  getCTZP_URL : function(){
    return process.env.CTZPURL || getProperties('citizenpedia_url') || default_CTZP;
  },
  getLogs_URL : function(){
    return process.env.LOGSURL || getProperties('logs_url') || default_logs;
  },
  getEservices : function(){
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
  },
  getLoginUser : function(){

    var env = null;
    var envUser = process.env.USERNAME;
    var envPass = process.env.PASSWORD;
    if (envUser && envPass) {
      env = {
        username: envUser,
        password: envPass
      }
    }

    return env || getProperties('login') || default_login;
  }
}
