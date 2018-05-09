# eSM




## Installation

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

Available environment variables:
- PORT: Make server listen in this particular port.
- BASEURL: Base URL from which eSM will hang. Default: "/".
- IFEURL: URL for the IFE service.
- CTZPURL: URL for the Citizenpedia service.
