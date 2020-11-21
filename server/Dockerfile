FROM node:12-alpine AS base

EXPOSE 4000

WORKDIR /var/www

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

FROM base AS development

CMD ["yarn", "dev"]