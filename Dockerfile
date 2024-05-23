FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV SECRET_SHOPPINGLIST='1234'

ENV PORT=3900

EXPOSE 3900

CMD ["npm", "start"]