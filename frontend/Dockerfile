FROM node:16-alpine AS build

WORKDIR /app/frontend/

COPY package*.json /app/frontend/

RUN npm ci --only=production

COPY . /app/frontend/

RUN npm run build


# dev
# FROM node:16-alpine

# WORKDIR /app/frontend/

# COPY package*.json /app/frontend/

# RUN npm config set unsafe-perm true

# RUN npm install

# COPY . /app/frontend/

# RUN chown -R node:node /app/frontend/node_modules

# CMD ["npm", "start"]