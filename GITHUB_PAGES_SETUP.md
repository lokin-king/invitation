# Як захостити це на GitHub Pages

## Варіант через браузер, без команд

1. Зайди на GitHub.
2. Натисни `+` → `New repository`.
3. Назви репозиторій, наприклад:

```text
date-invitation
```

4. Зроби репозиторій `Public`.
5. Натисни `Create repository`.
6. Натисни `uploading an existing file`.
7. Завантаж усі файли з цієї папки:

```text
index.html
styles.css
script.js
.nojekyll
telegram-worker.js
TELEGRAM_SETUP.md
```

8. Натисни `Commit changes`.
9. В репозиторії відкрий `Settings` → `Pages`.
10. У `Build and deployment` вибери:
    - `Source`: `Deploy from a branch`
    - `Branch`: `main`
    - Folder: `/root`
11. Натисни `Save`.

Через 1-3 хвилини посилання буде приблизно таке:

```text
https://ТВІЙ_USERNAME.github.io/date-invitation/
```

Це посилання можна кинути їй.

## Важливо про Telegram

GitHub Pages хостить тільки сайт. Щоб тобі приходив її вибір у Telegram, треба ще налаштувати Cloudflare Worker з файлу `telegram-worker.js`.

Після створення Worker встав його URL у `script.js`:

```js
const CONFIG = {
  telegramEndpoint: "https://your-worker.workers.dev"
};
```

Потім знову залий оновлений `script.js` на GitHub.
