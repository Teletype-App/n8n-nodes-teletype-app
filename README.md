# n8n-nodes-teletype
**Teletype Public API → n8n Community Nodes**

Набор кастомных нод для **n8n**, который подключает **Teletype Public API**: действия (Actions) и триггеры (Triggers) для работы с клиентами/диалогами/сообщениями/каналами и т.д.

---

## Что вы получите

- ✅ **Actions**: операции Teletype API в виде нод n8n
- 🔔 **Trigger**: приём событий из Teletype по Webhook URL (если Trigger включён в сборке)
- 🧩 Установка как **Community Nodes**
- 🌍 UI в n8n — **на английском**, а подсказки/описания — **на русском**

---

## Требования

- Self-hosted n8n (Community Nodes доступны в self-hosted установках)
- Доступ к проекту Teletype и **API Token**

---

## Установка (через интерфейс n8n)

1. Откройте **Settings → Community Nodes**
2. Нажмите **Install**
3. Введите имя пакета: `n8n-nodes-teletype`
4. Подтвердите установку
5. Перезапустите n8n (если попросит)

---

## Авторизация (Credentials)

Teletype Public API использует **токен проекта** (API Token).

Teletype принимает токен двумя способами:

- Заголовком:
  `X-Auth-Token: <ACCESS_TOKEN>`

- Или query-параметром:
  `?token=<ACCESS_TOKEN>`

Создание credentials в n8n:
1. Внутри ноды откройте **Credentials**
2. Создайте/выберите credential для Teletype
3. Вставьте токен и сохраните

---

## Webhooks / Events (важно)

В Teletype **все события отправляются на один Webhook URL**.
В документации события могут быть показаны как разные эндпоинты, но фактически URL один — различается содержимое события.

---

## Быстрый старт

1. Создайте credential **Teletype API**
2. Добавьте ноду **Teletype**
3. Выберите **Resource** и **Operation**
4. Заполните параметры (описания полей подскажут, что требуется)
5. Запустите workflow

---

## Troubleshooting

### Ноды не появились после установки
- Перезапустите n8n
- Убедитесь, что у n8n есть постоянный volume для `~/.n8n`
- Проверьте логи n8n на ошибки загрузки community nodes

### Trigger не ловит события
- Проверьте, что Webhook URL настроен в Teletype
- Убедитесь, что URL доступен из интернета (HTTPS, без авторизации на уровне прокси)
- Проверьте входящие запросы в Execution logs n8n

---
