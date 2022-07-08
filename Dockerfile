# initialize node
FROM node:16
# Working dir to app
WORKDIR /usr/src/app

# copy package and package-lock

COPY package*.json ./

# to run npm 

RUN npm install

# If using a code for production 
# RUN npm ci --only=production

# Bundle app source
COPY . .

# app binds to the port 
EXPOSE 8080

# initial file for node code 
CMD [ "node", "server.js" ]

