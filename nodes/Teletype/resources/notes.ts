import type { INodeProperties } from 'n8n-workflow';

export const notesDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['note'] },
		},
		options: [
			{
				name: 'List',
				value: 'list',
				description: 'Получить список заметок о клиенте',
				action: 'List notes',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Создать заметку для клиента',
				action: 'Create note',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Удалить заметку по её ID',
				action: 'Delete note',
			},
		],
		default: 'list',
	},
	{
		displayName: 'Client ID',
		name: 'clientId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['note'],
				operation: ['list', 'create'],
			},
		},
		default: '',
		description: 'Идентификатор клиента',
	},
	{
		displayName: 'Text',
		name: 'text',
		type: 'string',
		required: true,
		typeOptions: {
			rows: 4,
		},
		displayOptions: {
			show: {
				resource: ['note'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Текст заметки',
	},
	{
		displayName: 'Note ID',
		name: 'noteId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['note'],
				operation: ['delete'],
			},
		},
		default: '',
		description: 'Идентификатор заметки',
	},
];
