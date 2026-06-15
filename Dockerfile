FROM nginx:1.26.3-alpine3.20 as production-stage

# Install Headers More Module
RUN apk add --no-cache nginx-mod-http-headers-more

# Create application directory and copy app files
RUN mkdir /app
COPY ./dist /app
COPY nginx.conf /etc/nginx/nginx.conf

# Expose log directory and port
VOLUME /var/log/nginx/
EXPOSE 80

# Set the default command
CMD ["nginx", "-g", "daemon off;"]