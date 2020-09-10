FROM node:14.10.0-alpine3.12

ADD ./package.json /client/package.json
WORKDIR /client

RUN apk --no-cache add --update --virtual native-deps \
      g++ \
      gcc \
      git \
      make \
      openssh \
      python3 \
    && apk update && apk upgrade \
    && yarn global add typescript node-sass \
    && yarn install --force \
    && rm package.json \
    && apk del native-deps

RUN apk add --no-cache bash curl

ENV PATH /client/node_modules/.bin:$PATH

WORKDIR /client/app
