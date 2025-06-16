# Используем официальный Node образ для сборки
FROM node:18-alpine as build

# Рабочая директория
WORKDIR /app

# Копируем package.json и package-lock.json (если есть)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходники
COPY . .

# Собираем проект (используем скрипт из package.json, обычно "build")
RUN npm run build

# Второй этап — nginx для статического хостинга собранного приложения
FROM nginx:stable-alpine

# Копируем сборку из предыдущего этапа в папку nginx для отдачи
COPY --from=build /app/build /usr/share/nginx/html

# Открываем порт 80
EXPOSE 80

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]