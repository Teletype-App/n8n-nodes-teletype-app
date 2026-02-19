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
                description: 'Get list of notes for a client',
                action: 'List notes',
            },
            {
                name: 'Create',
                value: 'create',
                description: 'Create a note for a client',
                action: 'Create note',
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete a note by its ID',
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
        description: 'Client identifier',
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
        description: 'Note text',
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
        description: 'Note identifier',
    },
];