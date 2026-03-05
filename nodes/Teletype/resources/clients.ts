import type { INodeProperties } from 'n8n-workflow';

export const clientsDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['client'],
			},
		},
		options: [
			{
				name: 'Get Custom Fields',
				value: 'getCustomFields',
				action: 'Get custom fields',
				description: 'Получить пользовательские поля клиента',
			},
			{
				name: 'Get Details',
				value: 'getDetails',
				action: 'Get client details',
				description: 'Получить подробную информацию о клиенте',
			},
			{
				name: 'Get Last Dialog',
				value: 'getLastDialog',
				action: 'Get last dialog',
				description: 'Получить последний диалог клиента по дате последнего сообщения',
			},
			{
				name: 'List',
				value: 'list',
				action: 'List clients',
				description: 'Получить список клиентов с диалогами в текущем проекте',
			},
			{
				name: 'Set Custom Fields',
				value: 'setCustomFields',
				action: 'Set custom fields',
				description: 'Установить пользовательские поля клиента',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update client',
				description: 'Обновить данные клиента',
			},
		],
		default: 'list',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		// eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether, n8n-nodes-base/node-param-description-wrong-for-return-all
		description: 'Возвращать все результаты или только заданное количество',
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['list'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: {
			minValue: 1,
			maxValue: 500,
		},
		// eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-limit
		description: 'Максимальное число результатов',
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['list'],
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		default: 1,
		typeOptions: { minValue: 1 },
		description: 'Номер страницы',
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['list'],
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Page Size',
		name: 'pageSize',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1, maxValue: 500 },
		description: 'Количество элементов на странице',
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['list'],
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Client ID Filter',
		name: 'clientIdFilter',
		type: 'string',
		default: '',
		placeholder: '123456',
		description: 'Необязательный фильтр по ID клиента',
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['list'],
			},
		},
	},
	{
		displayName: 'Client Phone Filter',
		name: 'clientPhone',
		type: 'string',
		default: '',
		placeholder: '+79161234567',
		description: 'Необязательный фильтр по телефону клиента',
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['list'],
			},
		},
	},
	{
		displayName: 'Client ID',
		name: 'clientId',
		type: 'string',
		required: true,
		default: '',
		placeholder: '123456',
		description: 'Идентификатор клиента в Teletype',
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['getLastDialog', 'getDetails', 'update', 'getCustomFields', 'setCustomFields'],
			},
		},
	},
	{
		displayName: 'Channel ID',
		name: 'channelId',
		type: 'string',
		default: '',
		description: 'Необязательный фильтр по ID канала',
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['getLastDialog'],
			},
		},
	},
	{
		displayName: 'Channel Type',
		name: 'channelType',
		type: 'string',
		default: '',
		placeholder: 'whatsapp',
		description: 'Необязательный фильтр по типу канала',
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['getLastDialog'],
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'Имя клиента',
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Phone',
		name: 'phone',
		type: 'string',
		default: '',
		description: 'Телефон клиента',
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		default: '',
		description: 'Email клиента',
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Additional Payload',
		name: 'additionalPayload',
		type: 'json',
		default: '{}',
		description: 'Дополнительные данные клиента в формате JSON',
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Force Additional Payload',
		name: 'forceAdditionalPayload',
		type: 'boolean',
		default: false,
		// eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
		description: 'Следует ли перезаписать существующие дополнительные данные клиента',
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Custom Fields',
		name: 'customFields',
		type: 'fixedCollection',
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		options: [
			{
				name: 'values',
				displayName: 'Values',
				values: [
					{
						displayName: 'Field Key',
						name: 'key',
						type: 'string',
						default: '',
						placeholder: 'custom_field_1',
						description: 'Ключ поля без обёртки `values[ ]`',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Значение поля',
					},
				],
			},
		],
		description: 'Будет отправлено в формате `values[&lt;key&gt;]=&lt;value&gt;`',
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['setCustomFields'],
			},
		},
	},
];
