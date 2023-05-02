FROM node:14-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENV LOG_SERVER_ADDRESS=http://loggerator-server:8000

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
