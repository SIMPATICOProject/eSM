# eSM

eServices Manager

This module provides a dashboard to monitor e-services' check up on the results of analyzing the SIMPATICO logs.


## Installation

There are two ways of installing eSM after cloning into the repository.

```
git clone https://github.com/SIMPATICOProject/eSM.git
cd eSM
```

### 1) Docker

```
docker-compose up
```

Note: if you want to run it in detached mode (i.e. leave process in the background):
```
docker-compose up -d
```

### 2) Non-Docker

- [Optional] Install NVM
- Install Node.js
- Execute the following:
```
npm i
npm start
```


## Configurations

The eSM can be configured by adding the following options to the properties.json file.

- base_url: &lt;string&gt; //Base URL for eSM to hang from.
- citizenpedia_url: &lt;string&gt; //Citizenpedia API URL to obtain data.
- logs_url &lt;string&gt; //Logs API URL to obtain data.
- eservices &lt;array of objects&gt; //List of e-services selectable in eSM.
  {
    code &lt;string&gt;,
    name &lt;string&gt;
  }
- login &lt;object&gt; //Login credentials
{
  username &lt;string&gt;,
  password: &lt;string&gt;
}


Available environment variables:
- PORT: Make server listen in this particular port.
- BASEURL: Base URL from which eSM will hang. Default: "/".
- LOGSURL: URL for the Logs service.
- CTZPURL: URL for the Citizenpedia service.
- ESERVICES: List of eservices selectable in eSM.
  - Note: Must follow the format "code : name", with " : " separating code and name, and " ; " separating each key-value pair.
  - It is very important that the colon (":") and semi-colon (";") have space on BOTH SIDES.
  - e.g. ESERVICES="BS607A : Balnearios ; BS613B : Ayudas"
- USERNAME: Username to login (requires PASSWORD to be set).
- PASSWORD: Password for login (requires USERNAME to be set).


### Configurations hierarchy

Environment variables have precedence over the configurations set in properties.json file, which overwrite the default configurations.

DEFAULT VALUES:

- PORT: 3700
- BASEURL: "/"
- LOGSURL: "https://simpatico.hi-iberia.es:4570/simpatico/api"
- CTZPURL: "https://simpatico.hi-iberia.es:4569/qae/api"
- ESERVICES: []
- USERNAME:
- PASSWORD:
