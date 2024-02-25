FROM node:18.16.0-alpine3.17
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install 
COPY . ./
ENV PORT 3030 
EXPOSE $PORT

RUN npm run build
CMD [ "npm","run", "start" ]