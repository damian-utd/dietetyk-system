FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install axios

COPY . .

EXPOSE 5173

ENV CHOKIDAR_USEPOLLING=true

CMD ["npm", "run", "dev", "--", "--host"]


