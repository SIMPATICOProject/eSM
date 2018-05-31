# eSM

eServices Manager

This module provides a dashboard to check up on the results of analyzing the SIMPATICO logs.


## Installation

There are two ways of installing eSM,

```
git clone https://github.com/SIMPATICOProject/eSM.git
cd eSM
```

### Non-Docker

- [Optional] Install NVM
- Install Node.js
- Execute the following:
```
npm i
npm start
```


### Docker

```
docker-compose up
```

Note: if you want to run it in detached mode (i.e. leave process in the background):
```
docker-compose up -d
```



## Configurations

The eSM can be configured by adding the following options to the properties.json file.

- base_url: &lt;string&gt;
- citizenpedia_url: &lt;string&gt;
- logs_url &lt;string&gt;
- eservices &lt;array of objects&gt;
  {
    code &lt;string&gt;,
    name &lt;string&gt;
  }
- login &lt;object&gt;
{
  username &lt;string&gt;,
  password: &lt;string&gt;
}


Available environment variables:
- PORT: Make server listen in this particular port.
- BASEURL: Base URL from which eSM will hang. Default: "/".
- LOGSURL: URL for the Logs service.
- CTZPURL: URL for the Citizenpedia service.


### Configurations hierarchy

Environment variables have precedence over the configurations set in properties.json file, which overwrite the default configurations.
