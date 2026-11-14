## Описание проекта Food-Court (React + TypeScript + Vite):

### Архитектура: Mobile First, CSS на Tailwind v4. Разделение на pages (роуты) и components (изолированные UI-блоки). Роутинг классический компонентный (\<Routes>, \<Route>). Шапка <Header /> полностью изолирована от рендеров интерфейса.

### Авторизация: По номеру телефона (СМС-код 1111). Логика сессии (AuthContext) и логика управления модальным окном (ModalContext) разделены на два независимых провайдера. Реализован умный Redirect Back (сохранение намерения) через returnUrl и защиту роутов <ProtectedRoute> с помощью useEffect и флага isLoggingOut.

### Работа с данными: Бэкенд имитируется через JSON Server (db.json, порт 3001).

### Для отправки заказов написан кастомный хук useMutation с обработкой AbortController и try...catch.

### Для безопасной параллельной загрузки данных профиля (/orders и /addresses) создан кастомный хук useFetch с защитой от Race Conditions через controller.abort() в функции очистки useEffect.

### Реализован умный редирект из CheckoutForm при пустой корзине с guard-заглушкой return null для предотвращения мигания UI.

### На главной настроены ProductSkeleton (animate-pulse) и фильтрация продуктов.
