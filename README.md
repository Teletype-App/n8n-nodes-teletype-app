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

## Требования

- У вас должен быть доступ к **n8n** (самостоятельно установленный / корпоративный / Docker / сервер).
- У вас должен быть доступ к **проекту Teletype**, где можно открыть **Public API** и взять **API Token**.
- Для Trigger: ваш n8n должен быть **доступен из интернета** (HTTPS, без basic-auth на webhook, без блокировок).

> Если у вас нет доступа к настройкам n8n — попросите администратора разрешить и установить Community Nodes.

---

## Установка (через интерфейс n8n)

1. Откройте **Settings → Community Nodes**
2. Нажмите **Install**
3. Введите имя пакета: `n8n-nodes-teletype-app`
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

## Webhook URL в Teletype — один на все события (важно)

В Teletype **все события отправляются на один Webhook URL** (в настройках Public API).

Это значит:

- Если вы хотите обрабатывать события **в одном workflow** — просто используйте один **Teletype Trigger**.
- Если вам нужно разнести обработку на несколько сценариев — лучше сделать **один входной workflow** с Trigger и дальше маршрутизировать события внутри n8n (Switch/IF), либо вызывать другие workflow через **Execute Workflow**.

> Рекомендация: держите **один** Teletype Trigger как “входную точку”, а дальнейшую логику разносите по отдельным workflow.

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
2. Откройте ноду Trigger и скопируйте Webhook URL:
	- **Test URL** — подходит для тестов, когда вы нажимаете “Listen for test event” в редакторе
	- **Production URL** — используется для реальных событий, когда workflow **активирован (Activate)**

![Где взять Webhook URL в n8n (Teletype Trigger)](https://raw.githubusercontent.com/Teletype-App/n8n-nodes-teletype-app/main/docs/images/04-n8n-trigger-webhook-url.png)

3. Вставьте нужный URL в Teletype:
	- для тестов можно использовать **Test URL**
	- для продакшена используйте **Production URL** (и обязательно активируйте workflow в n8n)

4. В Teletype включите нужные события (галочки)
5. Запустите проверку:
	- **Тестовый режим:** в n8n нажмите “Listen for test event”, затем отправьте сообщение в чат
	- **Продакшен:** нажмите “Activate” у workflow и отправьте сообщение в чат

---

## Troubleshooting

### Ноды не появились после установки

- Перезапустите n8n
- Проверьте, что установка community nodes разрешена в вашей сборке
- Посмотрите логи n8n: иногда там видно причину, почему пакет не загрузился

---

### Trigger не ловит события

Проверьте по шагам:

0. Проверьте, какой URL вы вставили в Teletype:
	- если workflow НЕ активирован, а вы ждёте реальные события — **Production URL** не будет работать как ожидается
	- если workflow активирован, но в Teletype стоит **Test URL** — события не будут доходить в прод-режиме

1. **Webhook URL настроен в Teletype** (вставлен правильный адрес из Teletype Trigger)
2. **В Teletype включены нужные события** (поставлены галочки на те события, которые вы ждёте)
3. URL **доступен из интернета**:
	- HTTPS
	- без авторизации на уровне прокси / basic-auth
	- без блокировок firewall
4. Откройте **Executions** в n8n и проверьте, приходят ли запросы на webhook
5. Workflow в n8n **активирован (Activate)**, если вы используете Production URL
