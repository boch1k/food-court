## Внимание, проект предназначен только для локальной разработки !

# Food Court

Клиентское приложение для заказа еды на React, TypeScript и Vite. Интерфейс использует Tailwind CSS v4 и React Router. Заказы и адреса хранятся в db.json, предоставляется с помощью json-server.

## Требования

- Docker Engine и Docker Compose v2 на сервере.
- Файл `.env.production` в корне проекта с адресом API, доступным браузеру:

  ```dotenv
  VITE_API_URL=/api
  ```

  Vite встраивает это значение в приложение во время Docker-сборки. После изменения файла пересоберите образ.

## Деплой через Docker Compose

Compose запускает статический фронтенд в Nginx и json-server. На сервере подготовьте файл базы данных по пути, который указан в `docker-compose.yml` (по умолчанию `/home/github-runner/app-data/db.json`):

```sh
sudo mkdir -p /home/github-runner/app-data
sudo tee /home/github-runner/app-data/db.json >/dev/null <<'EOF'
{
  "orders": [],
  "addresses": []
}
EOF
```

Проверьте, что `.env.production` находится в корне проекта и содержит `VITE_API_URL=/api`. Затем из корня проекта выполните:

```sh
docker compose up -d --build
```

Приложение будет доступно на порту `8080` сервера. Настройте внешний reverse proxy или firewall, если нужен доступ из интернета; для HTTPS используйте TLS на внешнем proxy.

Полезные команды:

```sh
docker compose ps
docker compose logs -f frontend json-api
docker compose down
```

Данные json-server сохраняет в примонтированном файле на сервере. Не удаляйте и не заменяйте его при обновлении приложения, если нужно сохранить заказы и адреса. Для обновления кода получите новую версию проекта и повторите `docker compose up -d --build`.

В текущем Compose путь к базе задан абсолютным путём `/home/github-runner/app-data/db.json`. Если размещаете файл в другом месте, измените левую часть bind mount в `docker-compose.yml`.

## Локальная разработка

Требуется Node.js и pnpm. Установите зависимости и запустите Vite:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Для production-сборки и проверки типов:

```sh
pnpm run build
```

## Структура приложения

- `src/pages` — страницы и маршруты.
- `src/components` — переиспользуемые компоненты интерфейса.
- `src/context` — состояние авторизации, корзины и модальных окон.
- `src/hooks` — хуки для запросов, мутаций и локального хранилища.
- `src/utils/mockProducts.ts` — демонстрационные товары.

Авторизация в демонстрационной версии выполняется по номеру телефона с фиксированным кодом `1111`; она не заменяет серверную аутентификацию.
