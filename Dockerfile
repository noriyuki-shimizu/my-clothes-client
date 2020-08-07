FROM node:13.11.0-alpine

RUN mkdir /app
WORKDIR /app

COPY . .

RUN npm i -g @vue/cli
RUN npm ci
ENV HOST=0.0.0.0
CMD ["npm", "run", "serve"]