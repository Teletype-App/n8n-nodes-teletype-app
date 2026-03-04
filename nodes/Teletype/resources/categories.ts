import type { INodeProperties } from 'n8n-workflow';

export const categoriesDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['category'],
			},
		},
		options: [
			{
				name: 'List',
				value: 'list',
				description: 'Получить список категорий в проекте',
				action: 'List categories',
			},
			{
				name: 'Set Category for Dialog',
				value: 'setForDialog',
				description: 'Назначить категорию диалогу',
				action: 'Set category for dialog',
			},
		],
		default: 'list',
	},
	{
		displayName: 'Dialog ID',
		name: 'dialogId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['category'],
				operation: ['setForDialog'],
			},
		},
		default: '',
		description: 'Идентификатор диалога',
	},
	{
		displayName: 'Category ID',
		name: 'categoryId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['category'],
				operation: ['setForDialog'],
			},
		},
		default: '',
		description: 'Идентификатор категории (`category_appointed_id`)',
	},
];
