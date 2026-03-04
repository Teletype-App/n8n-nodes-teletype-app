# n8n-nodes-teletype-app
**Teletype Public API → n8n Community Nodes**

Набор нод для **n8n**, который подключает **Teletype Public API**: действия (Actions) и триггеры (Triggers) для работы с клиентами/диалогами/сообщениями/каналами.

---

## Что умеет

- ✅ **Actions**: операции Teletype API в виде нод n8n
- 🔔 **Trigger**: принимает события из Teletype по Webhook URL
- 🧩 Установка как **Community Nodes**
- 📝 Подсказки/описания в нодах — на русском

---

## Требования (простыми словами)

- Вам нужен **n8n, который установлен у вас/в вашей компании** (обычно это n8n на сервере или в Docker).
- Вам нужен доступ к **проекту Teletype** и его **API Token**.

> Если у вас нет доступа к настройкам n8n — попросите администратора установить Community Nodes.

---

## Установка (через интерфейс n8n)

1. Откройте **Settings → Community Nodes**
2. Нажмите **Install**
3. Введите имя пакета: `n8n-nodes-teletype`
4. Подтвердите установку
5. Перезапустите n8n (если попросит)

![Установка Community Nodes](https://raw.githubusercontent.com/Teletype-App/n8n-nodes-teletype-app/main/docs/images/01-community-nodes-install.png)

---

## Настройка в Teletype (API Token + Webhook + события)

В Teletype вам нужно:
1) взять **API Token** проекта
2) указать **Webhook URL** (для событий)
3) включить **нужные события** (галочки)

![Public API / Token / Webhook / Events](https://raw.githubusercontent.com/Teletype-App/n8n-nodes-teletype-app/main/docs/images/02-teletype-public-api-webhook-events.png)

---

## Авторизация в n8n (Credentials)

1. Внутри любой ноды Teletype откройте **Credentials**
2. Нажмите **Create new**
3. Выберите **Teletype API**
4. Вставьте **API Token** и сохраните

![Создание Credentials Teletype](https://raw.githubusercontent.com/Teletype-App/n8n-nodes-teletype-app/main/docs/images/03-n8n-credentials.png)

---

## Webhooks / Events (важно)

В Teletype **все события отправляются на один Webhook URL**.

---

## Быстрый старт

### 1) Проверка Actions (без триггера)
1. Создайте credential **Teletype API**
2. Добавьте ноду **Teletype**
3. Выберите нужный **Resource** и **Operation**
4. Запустите workflow

---

### 2) Подключение Trigger (получение событий из Teletype)

1. В n8n добавьте **Teletype Trigger**
2. Скопируйте Webhook URL из ноды Trigger
3. Вставьте Webhook URL в Teletype (см. скрин “Public API / Token / Webhook / Events”)
4. В Teletype включите нужные события (галочки)
5. Запустите workflow и отправьте тестовое событие (например, сообщение в чат)

---

## Troubleshooting

### Ноды не появились после установки
- Перезапустите n8n
- Проверьте, что установка community nodes разрешена в вашей сборке
- Посмотрите логи n8n: иногда там видно причину, почему пакет не загрузился

---

### Trigger не ловит события

Проверьте по шагам:

1. **Webhook URL настроен в Teletype** (вставлен правильный адрес из Teletype Trigger)
2. **В Teletype включены нужные события** (поставлены галочки на те события, которые вы ждёте)
3. URL **доступен из интернета**:
	- HTTPS
	- без авторизации на уровне прокси / basic-auth
	- без блокировок firewall
4. Откройте **Executions** в n8n и проверьте, приходят ли запросы на webhook
