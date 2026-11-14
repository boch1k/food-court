# Этап 1: Сборка приложения
FROM node:20-alpine AS builder
WORKDIR /app

# Активируем pnpm через встроенный в Node.js менеджер Corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Копируем файлы зависимостей именно для pnpm
COPY package.json pnpm-lock.yaml ./

# Устанавливаем зависимости строго по lock-файлу
RUN pnpm install --frozen-lockfile

# Копируем остальной код проекта и собираем бандл
COPY . .
RUN pnpm run build

# Этап 2: Раздача статики через Nginx
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
