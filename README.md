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


## Configuration

The eSM can be configured by adding the following options to the properties.json file.


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



#### properties.json


The `properties.json` contains your project's configuration parameters. The JSON object is composed of 3 main properties:

- urls: JSON object where the URLs used to populate the eSM with data are set.
- eservices: Array of eservices to be used within the eSM.
- login: JSON object storing the credentials of the user which will have access to the eSM.

##### Property `urls`

`urls` can have the following values:
- String URL: Will be used and return the value to eSM (or error, should there be one).
- Empty string: Will be treated as non-configured and "N/A" will be displayed as a result.
- Boolean value:
  - `true`: Same as empty string.
  - `false`: Data output in eSM will not be shown.
- If a property is removed from the JSON, it will be treated as with `false`. However, it is discouraged in favor of `false`.

<b>Important Notes!</b>
- All URLs use method GET.
- Use `::eservice` in the URL where the eservice code is expected to be. The eservice code will be replaced into that string. eg. `http:/simpatico.com/api/total/::eservice`

JSON | ENV variable | Description | Expected
--- | --- | --- | ---
total_requests | TOTALREQUESTS | Total number of requests | Number
finished_requests | FINISHEDREQUESTS | Number of finished requests | Number
average_time | AVERAGETIME | Average time spent by users | Number
average_age | AVERAGEAGE | Average age of users | Number
emotions | EMOTIONS | Satisfaction results as Happy, Normal and Sad | Array of numbers: [happy, normal, sad]
sat_comment | SATCOMMENT | All comments left by users upon finishing their use | String
ctzp_use | CTZPUSE | Number of uses of Citizenpedia module over total requests | Number
ctzp_useful | CTZPUSEFUL | Usefulness of Citizenpedia module | Number
ctzp_relevant | CTZPRELEVANT | Value for how relevant the Citizenpedia module is to users | Number
tae_use | TAEUSE | Number of uses of TAE module over total requests | Number
tae_useful | TAEUSEFUL | Usefulness of TAE module | Number
tae_revelant | TAERELEVANT | Value for how relevant the TAE module is to users | Number
cdv_use | CDVUSE | Number of uses of CDV module over total requests | Number
cdv_useful | CDVUSEFUL | Usefulness of CDV module | Number
cdv_revelant | CDVRELEVANT | Value for how relevant the CDV module is to users | Number
wae_use | WAEUSE | Number of uses of WAE module over total requests | Number
wae_useful | WAEUSEFUL | Usefulness of WAE module | Number
wae_relevant | WAERELEVANT | Value for how relevant the WAE module is to users | Number
questions_stats | QUESTIONSSTATS | Number of questions by users | Number
questions_qae | QUESTIONSQAE | All data related to users' questions | Array of data*

\* Data related to questions. As of this version, each object in the array (representing a question) has to include the following data (will most likely contain more though). 
```
{
  content: "string",
  answers: [array of objects],
  stars: [array of strings (ids)],
  tags: [array of objects]
}
```

#### Property `eservices`

To set up your own list of `eservices` that can be shown on eSM, you need to represent them by adding them by using one of these two methods:

- Via `properties.json` file:
  - `eservices` is an array of objects.
  - Each object represents one eservice, and it has two properties:
    - `code`: String as code of eservice.
    - `name`: String as short description of eservice.

e.g.
```
{
  code: "code for eservice",
  name: "string to show in the select input in eSM"
}
```

- Via Environment variable:
  - Note: Must follow the format "code : name", with " : " separating code and name, and " ; " separating each key-value pair.
  - It is very important that the colon (":") and semi-colon (";") have space on BOTH SIDES.

e.g.
```
ESERVICES= "code : name ; code : name"
```


#### Property `login`

To configure your own custom user credentials (only one for now) in order to access the eSM dashboard, you have two options:

- Via `properties.json` file:
  - `login` is an object that contains properties `username` and `password`.
  - Both are needed in order to override the default. They have to be of type string.
- Via Environment variables:
  - `USERNAME` and `PASSWORD`
  - Both must be configured to work properly.

If no login configuration is found, no username or password will be used.


#### Further configuration

The port in which the server is listening at can also be configured with the environment variable `PORT`.
