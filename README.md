# Web Technologies Exam — Calculator

Веб‑застосунок «Калькулятор», який обчислює:
- сума (+), різниця (−), добуток (×), частка (÷) двох дійсних чисел;
- **ln**, **sin**, **tan** для **першого** операнда (`Operand 1`), де аргументи sin/tan задані **у градусах**.

Для **ln/sin/tan** відображається довідка, яка підтягується зі **статичних JSON‑файлів**:
- `data/log.json`
- `data/sin.json`
- `data/tan.json`

## Як запустити локально
Відкрийте `index.html` через будь‑який static server (щоб працював `fetch/XHR`), наприклад:
- VS Code → Live Server
- або `python -m http.server 8000` (у корені проєкту), далі перейти на `http://localhost:8000`

## GitHub Pages (для екзамену)
1. Створіть репозиторій на GitHub і залийте сюди всі файли.
2. В репозиторії: **Settings → Pages → Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: `main` (або `master`) / `root`
3. Після деплою отримаєте посилання типу:
   - `https://<username>.github.io/<repo>/`

У відповідь на завдання прикріпіть:
- посилання на GitHub Pages
- посилання на сам репозиторій
- zip‑архів репозиторію

