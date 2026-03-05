import type { INodeProperties } from 'n8n-workflow';

export const templatesDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['template'] },
		},
		options: [
			{
				name: 'List',
				value: 'list',
				description: 'Получить список шаблонов быстрых ответов в проекте',
				action: 'List templates',
			},
			{
				name: 'List Directories',
				value: 'listDirectories',
				description: 'Получить список папок с шаблонами быстрых ответов',
				action: 'List template directories',
			},
		],
		default: 'list',
	},
];
