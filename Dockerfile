FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

ARG ENVIRONMENT
COPY .env.${ENVIRONMENT} .env

RUN npm run build

FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY default.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/dist /usr/share/nginx/html

RUN mkdir -p /var/cache/nginx/client_temp && \
  chown -R 1000:1000 /var/cache/nginx

RUN mkdir -p /var/run/nginx && \
  chown -R 1000:1000 /var/run/nginx

RUN chown -R 1000:1000 /var/log/nginx

USER 1000

EXPOSE 8081

CMD ["nginx", "-g", "daemon off;"]