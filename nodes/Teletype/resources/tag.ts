import type { INodeProperties } from 'n8n-workflow';

export const tagOperationsDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['tag'],
			},
		},
		options: [
			{
				name: 'List',
				value: 'list',
				description: 'Получить список тегов, доступных в проекте',
				action: 'List tags',
			},
			{
				name: 'Add Tag to Client',
				value: 'addToClient',
				description: 'Добавить тег клиенту',
				action: 'Add tag to client',
			},
			{
				name: 'Remove Tag From Client',
				value: 'removeFromClient',
				description: 'Удалить тег у клиента',
				action: 'Remove tag from client',
			},
		],
		default: 'list',
	},
];

export const tagFieldsDescription: INodeProperties[] = [
	{
		displayName: 'Client ID',
		name: 'clientId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['addToClient', 'removeFromClient'],
			},
		},
		default: '',
		description: 'Идентификатор клиента',
	},
	{
		displayName: 'Tag ID',
		name: 'tagId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['addToClient', 'removeFromClient'],
			},
		},
		default: '',
		description: 'Идентификатор тега',
	},
];
