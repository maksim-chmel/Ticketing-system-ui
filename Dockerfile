# Установка зависимостей и сборка
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Сервер для статики
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

# Удаляем стандартный конфиг и подставляем свой при необходимости
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]