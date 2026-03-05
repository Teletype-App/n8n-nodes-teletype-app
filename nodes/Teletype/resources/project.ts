import type { INodeProperties } from 'n8n-workflow';

const WEBHOOK_TYPES = [
	'new message',
	'success send',
	'message status change',
	'new note',
	'new dialog',
	'open dialog',
	'close dialog',
	'person change',
	'appeal rate',
	'messages templates updated',
	'session operator changed',
];

export const projectDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['project'] },
		},
		options: [
			{
				name: 'Get API Status',
				value: 'getApiStatus',
				description: 'Получить информацию о статусе Public API в проекте',
				action: 'Get API status',
			},
			{
				name: 'Get Balance',
				value: 'getBalance',
				description: 'Получить информацию о балансе проекта',
				action: 'Get balance',
			},
			{
				name: 'Get Details',
				value: 'getDetails',
				description: 'Получить данные проекта: ID, name, domain и другие поля',
				action: 'Get project details',
			},
			{
				name: 'Get Operators',
				value: 'getOperators',
				description: 'Получить список операторов, подключённых к проекту',
				action: 'Get operators',
			},
			{
				name: 'Get Tariff',
				value: 'getTariff',
				description: 'Получить информацию о тарифе проекта',
				action: 'Get tariff',
			},
			{
				name: 'Update Public API Settings',
				value: 'updatePublicApi',
				description: 'Обновить URL webhook Public API и список активных типов webhook',
				action: 'Update public API settings',
			},
		],
		default: 'getDetails',
	},
	{
		displayName: 'API Webhook URL',
		name: 'apiWebhook',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['updatePublicApi'],
			},
		},
		default: '',
		description: 'Новый URL для `api_webhook`; оставьте поле пустым, чтобы не изменять текущее значение',
	},
	{
		displayName: 'Active Webhooks',
		name: 'activeWebhooks',
		type: 'multiOptions',
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['updatePublicApi'],
			},
		},
		options: WEBHOOK_TYPES.map((t) => ({ name: t, value: t })),
		default: [],
		description: 'Список типов webhook, которые должны оставаться активными',
	},
];
