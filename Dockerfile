FROM node:12

WORKDIR /usr/src

COPY . .

RUN pwd && ls
RUN npm install && npm run build

EXPOSE 8080

CMD [ "node", "build/app.js" ]