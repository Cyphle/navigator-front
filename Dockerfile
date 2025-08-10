# ---- Build Stage ----
FROM node:22.18.0-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---- Production Stage ----
#FROM nginx:alpine
#
#COPY nginx.conf /etc/nginx/conf.d/default.conf
#COPY --from=builder /app/build /usr/share/nginx/html
#
#RUN chown -R nginx:nginx /var/cache/nginx /var/log/nginx /usr/share/nginx/html && \
#    mkdir -p /tmp/nginx && \
#    chown -R nginx:nginx /tmp/nginx
#
#USER nginx
#
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]
FROM nginx:latest AS prod

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# NON ROOT
#RUN touch /var/run/nginx.pid
#RUN chown -R nginx:nginx /var/run/nginx.pid /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d
#USER nginx
# END NON ROOT

EXPOSE 80/tcp

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
