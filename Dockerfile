FROM  node:6.14.1

COPY . /

WORKDIR /

RUN npm i

EXPOSE 3700

CMD ["npm", "start"]
