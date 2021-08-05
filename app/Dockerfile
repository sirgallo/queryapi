FROM node:lts-alpine

WORKDIR /usr/src/queryapi

COPY package*.json ./

RUN apk --no-cache add curl
RUN npm install

COPY . .

EXPOSE 5679

CMD ["npm", "start"]