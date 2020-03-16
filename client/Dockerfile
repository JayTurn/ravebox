FROM node:12.16.1-alpine3.9

ADD ./package.json /client/package.json
WORKDIR /client

RUN apk --no-cache add --virtual native-deps \
      g++ \
      gcc \
      git \
      make \
      openssh \
      python \
    && apk update && apk upgrade \
    && yarn global add typescript node-sass \
    && yarn install --force \
    && rm package.json \
    && apk del native-deps

RUN apk add --no-cache bash curl

ENV PATH /client/node_modules/.bin:$PATH

WORKDIR /client/app
