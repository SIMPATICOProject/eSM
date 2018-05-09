var properties = require('./properties.json');


var default_base = "/";
var default_CTZP = "https://simpatico.hi-iberia.es:4569/qae/api";
var default_IFE = "https://simpatico.hi-iberia.es:4570/simpatico/api";


module.exports = {
  base_url : process.env.BASEURL || (properties? properties.base_url: null) || default_base,
  ctzp_url : process.env.CTZPURL || (properties? properties.citizenpedia_url: null) || default_CTZP,
  ife_url : process.env.IFEURL || (properties? properties.ife_url: null) || default_IFE
};
